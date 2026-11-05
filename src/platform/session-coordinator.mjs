/** 跨标签页只持久化不含凭据的版本标记；刷新结果通过同源频道短暂传递。 */
export function createSessionCoordinator(io) {
  let latest;
  const waiters = new Set();
  const canceled = () => new Error("admin.requestCanceled");
  const unsubscribe = io.subscribe(message => {
    if (!message || typeof message !== "object") return;
    if (message.type === "invalidate") {
      latest = undefined;
      waiters.forEach(waiter => waiter.reject(canceled()));
      io.onInvalidate();
    } else if (message.type === "result") {
      if (message.stamp !== io.readVersion()) return;
      latest = message;
      waiters.forEach(waiter => {
        if (waiter.stamp === message.stamp) waiter.resolve(message);
      });
    } else if (message.type === "request" && latest?.stamp === message.stamp) {
      io.send(latest);
    }
  });
  function invalidate() {
    latest = undefined;
    io.writeVersion("reset:" + io.randomId());
    waiters.forEach(waiter => waiter.reject(canceled()));
    io.send({ type: "invalidate" });
  }
  async function received(stamp) {
    if (stamp.startsWith("reset:")) throw canceled();
    if (latest?.stamp === stamp) return latest;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(
        () => waiter.reject(canceled()),
        io.timeout ?? 2000
      );
      const waiter = {
        stamp,
        resolve(value) {
          clearTimeout(timer);
          waiters.delete(waiter);
          resolve(value);
        },
        reject(error) {
          clearTimeout(timer);
          waiters.delete(waiter);
          reject(error);
        }
      };
      waiters.add(waiter);
      io.send({ type: "request", stamp });
    });
  }
  const unwrap = result => {
    if (result.failed) throw new Error("admin.serviceUnavailable");
    return result.value;
  };
  return {
    invalidate,
    async refresh(run) {
      const before = io.readVersion();
      return io.lock(async () => {
        const current = io.readVersion();
        // 已有另一个标签页完成本批刷新，只接收其结果，丢失时失败关闭。
        if (current !== before) return unwrap(await received(current));
        let value,
          failed = false;
        try {
          value = await run();
        } catch {
          failed = true;
        }
        if (io.readVersion() !== before) throw canceled();
        const stamp = "result:" + io.randomId();
        latest = { type: "result", stamp, value, failed };
        io.writeVersion(stamp);
        io.send(latest);
        return unwrap(latest);
      });
    },
    async exclusive(run) {
      invalidate();
      return io.lock(async () => {
        try {
          return await run();
        } finally {
          invalidate();
        }
      });
    },
    dispose() {
      unsubscribe();
      latest = undefined;
      waiters.forEach(waiter => waiter.reject(canceled()));
    }
  };
}
