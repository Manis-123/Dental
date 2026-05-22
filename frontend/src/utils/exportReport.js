export function downloadCSV(filename, rows) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(','),
    ...rows.map((r) => headers.map((h) => `"${String(r[h] ?? '').replace(/"/g, '""')}"`).join(',')),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function printReport(title, htmlContent) {
  const win = window.open('', '_blank');
  win.document.write(`
    <!DOCTYPE html><html><head><title>${title}</title>
    <style>
      body{font-family:system-ui,sans-serif;padding:24px;color:#134e4a}
      h1{font-size:1.25rem} table{width:100%;border-collapse:collapse;margin-top:16px}
      th,td{border:1px solid #99f6e4;padding:8px;text-align:left;font-size:12px}
      th{background:#ccfbf1}
      .summary{display:flex;gap:24px;margin:16px 0;flex-wrap:wrap}
      .summary div{background:#f0fdfa;padding:12px 16px;border-radius:8px}
    </style></head><body>
    <h1>${title}</h1>${htmlContent}
    <script>window.onload=()=>{window.print();}</script></body></html>`);
  win.document.close();
}
