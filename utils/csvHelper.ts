export const parseResilientCSV = (text: string, expectedColumns: number) => {
  const rawLines = text.split('\n');
  const mergedLines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i].replace(/\r/g, '').trim();
    if (!line && !currentLine) continue;
    
    currentLine = currentLine ? currentLine + ' ' + line : line;
    const semicolonCount = (currentLine.match(/;/g) || []).length;
    
    if (semicolonCount >= expectedColumns - 1) {
      mergedLines.push(currentLine);
      currentLine = '';
    }
  }
  if (currentLine) mergedLines.push(currentLine);
  return mergedLines;
};