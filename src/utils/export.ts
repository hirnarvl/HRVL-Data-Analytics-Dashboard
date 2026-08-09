export function generateCSVString(rows: Record<string, any>[]): string {
  if (!rows || !rows.length) return '';
  const keys = Object.keys(rows[0]);
  const header = keys.join(',');

  const csvContent = rows
    .map(row =>
      keys
        .map(key => {
          let val = row[key];
          if (val === undefined || val === null) val = '';
          val = String(val).replace(/"/g, '""');
          if (val.includes(',') || val.includes('\n') || val.includes('"')) {
            val = `"${val}"`;
          }
          return val;
        })
        .join(',')
    )
    .join('\n');

  return `${header}\n${csvContent}`;
}

export function exportToCSV(filename: string, rows: Record<string, any>[]) {
  const content = generateCSVString(rows);
  if (!content) return;

  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
