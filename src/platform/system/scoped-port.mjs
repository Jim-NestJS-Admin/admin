/** 关联列表固定归属，防止搜索、常用查询或表单值覆盖当前记录；后端仍独立鉴权。 */
export function scopePort(base, fixed) {
  if (!fixed) return base;
  const scopedQuery = query => ({
    ...query,
    equality: { ...query.equality, ...fixed }
  });
  return {
    ...base,
    describe: async signal => {
      const schema = await base.describe(signal);
      return {
        ...schema,
        form: schema.form.filter(item => !(item.field in fixed))
      };
    },
    list: (query, signal) => base.list(scopedQuery(query), signal),
    create: base.create
      ? (values, context) => base.create({ ...values, ...fixed }, context)
      : undefined,
    update: base.update
      ? (identity, values, context) =>
          base.update(identity, { ...values, ...fixed }, context)
      : undefined,
    export: base.export
      ? (query, signal) => base.export(scopedQuery(query), signal)
      : undefined
  };
}
