export function journalTextToMarkdown(txt) {
    const lines = txt.replace(/\r\n/g, "\n").split("\n");
    const md = [];

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (!line) {
            md.push("");
            continue;
        }

        // Convert "Header:" → "**Header**"
        if (/^[A-Za-z ()]+:\s*$/.test(line)) {
            const header = line.replace(/:\s*$/, "");
            md.push(`**${header}**  `);
            continue;
        }

        // Convert "Key - Value" lines into bullets or plain lines
        if (/^[A-Za-z ()]+ - /.test(line)) {
            md.push(`${line.replace(/\s*-\s*/, " — ")}  `);
            continue;
        }

        // Preserve bullet points
        if (/^-\s+/.test(line)) {
            md.push(`${line}  `);
            continue;
        }

        // Indented or subitems: make sub-bullets
        if (/^\s{2,}[A-Za-z0-9]/.test(lines[i])) {
            md.push(`- ${line}  `);
            continue;
        }

        // Default
        md.push(`${line}  `);
    }

    return md.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}
