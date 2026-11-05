import test from "node:test";
import assert from "node:assert/strict";
import { createSessionCoordinator } from "../src/platform/session-coordinator.mjs";
function tabs({ dropResults = false } = {}) {
  let version = "",
    sequence = 0,
    queue = Promise.resolve();
  const listeners = new Map();
  const storage = [];
  function create(onInvalidate = () => {}) {
    const id = ++sequence;
    return createSessionCoordinator({
      timeout: 30,
      randomId: () => String(++sequence),
      readVersion: () => version,
      writeVersion: value => {
        version = value;
        storage.push(value);
      },
      lock: run => {
        const next = queue.then(run);
        queue = next.catch(() => {});
        return next;
      },
      send: message => {
        if (dropResults && message.type === "result") return;
        setImmediate(() => {
          for (const [peer, listener] of listeners)
            if (peer !== id) listener(structuredClone(message));
        });
      },
      subscribe: listener => {
        listeners.set(id, listener);
        return () => listeners.delete(id);
      },
      onInvalidate
    });
  }
  return { create, storage };
}
test("跨标签页同时刷新只执行一次，迟到的频道消息可按版本取回", async () => {
  const environment = tabs();
  const a = environment.create(),
    b = environment.create();
  let calls = 0;
  const action = async () => {
    calls++;
    return { accessToken: "synthetic-memory-value" };
  };
  try {
    const values = await Promise.all([a.refresh(action), b.refresh(action)]);
    assert.equal(calls, 1);
    assert.deepEqual(values[0], values[1]);
    assert.ok(environment.storage.every(value => !value.includes("synthetic")));
  } finally {
    a.dispose();
    b.dispose();
  }
});
test("刷新失败共同拒绝，等待者不再刷新一次", async () => {
  const environment = tabs();
  const a = environment.create(),
    b = environment.create();
  let calls = 0;
  try {
    const result = await Promise.allSettled([
      a.refresh(async () => {
        calls++;
        throw Error();
      }),
      b.refresh(async () => {
        calls++;
      })
    ]);
    assert.equal(calls, 1);
    assert.ok(result.every(value => value.status === "rejected"));
  } finally {
    a.dispose();
    b.dispose();
  }
});
test("结果消息丢失时失败关闭，不再次轮换 Cookie", async () => {
  const environment = tabs({ dropResults: true });
  const a = environment.create(),
    b = environment.create();
  let calls = 0;
  try {
    const result = await Promise.allSettled([
      a.refresh(async () => {
        calls++;
        return "value";
      }),
      b.refresh(async () => {
        calls++;
      })
    ]);
    assert.equal(calls, 1);
    assert.equal(result[1].status, "rejected");
  } finally {
    a.dispose();
    b.dispose();
  }
});
test("退出使正在刷新的旧结果作废，并通知其他标签页", async () => {
  const environment = tabs();
  let notified = 0;
  const a = environment.create(),
    b = environment.create(() => notified++);
  let resolve;
  try {
    const pending = a.refresh(
      () =>
        new Promise(done => {
          resolve = done;
        })
    );
    await new Promise(done => setImmediate(done));
    a.invalidate();
    resolve("old-session");
    await assert.rejects(pending);
    await new Promise(done => setImmediate(done));
    assert.equal(notified, 1);
  } finally {
    a.dispose();
    b.dispose();
  }
});
