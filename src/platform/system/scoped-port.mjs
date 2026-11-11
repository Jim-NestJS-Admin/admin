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
      // 固定归属的字段每行都相同：表单、列表列、查询项里都不再显示
      const free = item => !(item.field in fixed);
      return {
        ...schema,
        form: schema.form.filter(free),
        ...(schema.columns ? { columns: schema.columns.filter(free) } : {}),
        ...(schema.query ? { query: schema.query.filter(free) } : {})
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
      ? (query, signal, options) =>
          base.export(scopedQuery(query), signal, options)
      : undefined
  };
}
