/**
 * 代码预览的两个小工具：行级差异和简单语法高亮。
 * 只在开发环境的生成器页面用，不引入新依赖；高亮只区分注释、字符串、关键字、数字，够看就行。
 */

export interface DiffLine {
  kind: "same" | "add" | "remove" | "skip";
  /** 原文件行号 / 生成后行号 */
  left?: number;
  right?: number;
  text: string;
}

/** 行级差异（最长公共子序列）；只保留改动附近 context 行，其余折成一行「省略 n 行」 */
export function lineDiff(
  before: string,
  after: string,
  context = 3
): DiffLine[] {
  const a = before.split("\n"),
    b = after.split("\n");
  // 去掉相同的头尾，缩小矩阵
  let head = 0;
  while (head < a.length && head < b.length && a[head] === b[head]) head++;
  let tail = 0;
  while (
    tail < a.length - head &&
    tail < b.length - head &&
    a[a.length - 1 - tail] === b[b.length - 1 - tail]
  )
    tail++;
  const x = a.slice(head, a.length - tail),
    y = b.slice(head, b.length - tail);
  const body: DiffLine[] = [];
  if (x.length * y.length > 4_000_000) {
    // 太大时不求最优，整段替换
    x.forEach(text => body.push({ kind: "remove", text }));
    y.forEach(text => body.push({ kind: "add", text }));
  } else {
    const width = y.length + 1;
    const table = new Uint32Array((x.length + 1) * width);
    for (let i = x.length - 1; i >= 0; i--)
      for (let j = y.length - 1; j >= 0; j--)
        table[i * width + j] =
          x[i] === y[j]
            ? table[(i + 1) * width + j + 1] + 1
            : Math.max(table[(i + 1) * width + j], table[i * width + j + 1]);
    let i = 0,
      j = 0;
    while (i < x.length || j < y.length) {
      if (i < x.length && j < y.length && x[i] === y[j]) {
        body.push({ kind: "same", text: x[i] });
        i++;
        j++;
      } else if (
        j < y.length &&
        (i === x.length ||
          table[i * width + j + 1] >= table[(i + 1) * width + j])
      ) {
        body.push({ kind: "add", text: y[j] });
        j++;
      } else {
        body.push({ kind: "remove", text: x[i] });
        i++;
      }
    }
  }
  const all: DiffLine[] = [
    ...a.slice(0, head).map(text => ({ kind: "same" as const, text })),
    ...body,
    ...a.slice(a.length - tail).map(text => ({ kind: "same" as const, text }))
  ];
  let left = 0,
    right = 0;
  for (const line of all) {
    if (line.kind !== "add") line.left = ++left;
    if (line.kind !== "remove") line.right = ++right;
  }
  // 折叠离改动较远的相同行
  const near = all.map(() => false);
  all.forEach((line, index) => {
    if (line.kind === "same") return;
    for (
      let k = Math.max(0, index - context);
      k <= Math.min(all.length - 1, index + context);
      k++
    )
      near[k] = true;
  });
  const result: DiffLine[] = [];
  let skipped = 0;
  all.forEach((line, index) => {
    if (near[index]) {
      if (skipped) result.push({ kind: "skip", text: String(skipped) });
      skipped = 0;
      result.push(line);
    } else skipped++;
  });
  if (skipped) result.push({ kind: "skip", text: String(skipped) });
  return result;
}

export function diffStats(lines: DiffLine[]) {
  return {
    added: lines.filter(line => line.kind === "add").length,
    removed: lines.filter(line => line.kind === "remove").length
  };
}

const KEYWORDS: Record<string, Set<string>> = {
  ts: new Set(
    "import export from as default class extends implements interface type enum const let var function return async await new this super if else for of in while do switch case break continue try catch finally throw typeof instanceof keyof readonly private protected public static abstract declare void null undefined true false".split(
      " "
    )
  ),
  sql: new Set(
    "CREATE TABLE NOT NULL DEFAULT PRIMARY KEY UNIQUE INDEX AUTO_INCREMENT COMMENT GENERATED ALWAYS AS IF IS STORED ON UPDATE CURRENT_TIMESTAMP UNSIGNED BIGINT INT VARCHAR CHAR TEXT DATE DATETIME DECIMAL BOOLEAN JSON TINYINT".split(
      " "
    )
  )
};

export type Token = {
  kind: "plain" | "comment" | "string" | "keyword" | "number" | "tag";
  text: string;
};

/** 按文件名选语言：.sql / .ts / .vue / .json / .yaml，其余当纯文本 */
export function languageOf(path: string) {
  if (path.endsWith(".sql")) return "sql";
  if (path.endsWith(".vue")) return "vue";
  if (/\.(ts|mts|js|mjs|tsx)$/.test(path)) return "ts";
  if (path.endsWith(".json")) return "json";
  if (/\.ya?ml$/.test(path)) return "yaml";
  return "text";
}

const PATTERNS: Record<string, RegExp> = {
  ts: /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)|(<\/?[A-Za-z][\w-]*|\/?>)|\b(\d+(?:\.\d+)?)\b|([A-Za-z_$][\w$]*)/g,
  sql: /(--[^\n]*)|('(?:''|[^'])*'|`[^`]*`)|\b(\d+(?:\.\d+)?)\b|([A-Za-z_][\w]*)/g,
  json: /("(?:\\.|[^"\\])*")(\s*:)?|\b(-?\d+(?:\.\d+)?|true|false|null)\b/g,
  yaml: /(#[^\n]*)|("(?:\\.|[^"\\])*"|'[^']*')|^(\s*[\w.-]+)(?=:)/gm
};

/** 把一段代码切成带类别的片段；模板里逐段渲染成 span，不拼 HTML */
export function tokenize(code: string, language: string): Token[] {
  // .vue 和 .ts 用同一套规则，只有 .vue 把 <标签> 标成标签色（.ts 里的 <T> 是泛型）
  const vue = language === "vue";
  if (vue) language = "ts";
  const pattern = PATTERNS[language];
  if (!pattern) return [{ kind: "plain", text: code }];
  const tokens: Token[] = [];
  let last = 0;
  const push = (kind: Token["kind"], text: string) => {
    if (!text) return;
    const previous = tokens[tokens.length - 1];
    if (previous && previous.kind === kind) previous.text += text;
    else tokens.push({ kind, text });
  };
  pattern.lastIndex = 0;
  for (let match = pattern.exec(code); match; match = pattern.exec(code)) {
    if (match[0] === "") {
      pattern.lastIndex++;
      continue;
    }
    push("plain", code.slice(last, match.index));
    last = match.index + match[0].length;
    if (language === "ts") {
      if (match[1]) push("comment", match[1]);
      else if (match[2]) push("string", match[2]);
      else if (match[3]) push(vue ? "tag" : "plain", match[3]);
      else if (match[4]) push("number", match[4]);
      else push(KEYWORDS.ts.has(match[5]) ? "keyword" : "plain", match[5]);
    } else if (language === "sql") {
      if (match[1]) push("comment", match[1]);
      else if (match[2]) push("string", match[2]);
      else if (match[3]) push("number", match[3]);
      else
        push(
          KEYWORDS.sql.has(match[4].toUpperCase()) ? "keyword" : "plain",
          match[4]
        );
    } else if (language === "json") {
      if (match[1]) {
        push(match[2] ? "keyword" : "string", match[1]);
        if (match[2]) push("plain", match[2]);
      } else push("number", match[3]);
    } else {
      if (match[1]) push("comment", match[1]);
      else if (match[2]) push("string", match[2]);
      else push("keyword", match[3]);
    }
  }
  push("plain", code.slice(last));
  return tokens;
}

/** 按行切 token，代码视图要带行号 */
export function tokenLines(code: string, language: string): Token[][] {
  const lines: Token[][] = [[]];
  for (const token of tokenize(code, language)) {
    const parts = token.text.split("\n");
    parts.forEach((part, index) => {
      if (index > 0) lines.push([]);
      if (part) lines[lines.length - 1].push({ kind: token.kind, text: part });
    });
  }
  return lines;
}

/**
 * 预览用的 SQL 排版：后端给的是一行一条语句，括号里的列和索引按顶层逗号换行，
 * 只改空白，不改语句内容；字符串和反引号里的逗号、括号不算。
 */
export function formatSql(statement: string): string {
  let depth = 0,
    quote = "",
    out = "";
  for (let i = 0; i < statement.length; i++) {
    const char = statement[i];
    if (quote) {
      out += char;
      if (char === quote) {
        if (quote === "'" && statement[i + 1] === "'") out += statement[++i];
        else quote = "";
      }
      continue;
    }
    if (char === "'" || char === "`" || char === '"') {
      quote = char;
      out += char;
    } else if (char === "(") {
      depth++;
      out += depth === 1 ? "(\n  " : char;
    } else if (char === ")") {
      out += depth === 1 ? "\n)" : char;
      depth = Math.max(0, depth - 1);
    } else if (char === "," && depth === 1) {
      out += ",\n  ";
      while (statement[i + 1] === " ") i++;
    } else out += char;
  }
  return out;
}
