export function buildContext(chunks) {
  if (chunks.length === 0) return [];

  const docMap = new Map();

// Groups chunks by doc_id
  for (const c of chunks) {
    const key = c.doc_id;
    if (!docMap.has(key)) docMap.set(key, []);
    docMap.get(key).push({
      chunk_index: c.chunk_index,
      text_chunk: c.text_chunk
    });
  }

// Splits chunk in: "HEADER --- BODY"
  function splitHeaderBody(text) {
    let [header, body] = text.split(/---\s*/);
    header += "\n---\n";
    return { header, body };
  }

  const result = [];

  let i=0;
// For each doc, sort by chunk_index, take header from lowest index, then append bodies
  for (const [docId, arr] of docMap.entries()) {
    i++;

    arr.sort((a, b) => a.chunk_index - b.chunk_index);

    // first element provides the header
    const { header: firstHeader, body: firstBody } = splitHeaderBody(arr[0].text_chunk);

    let chunkString = "Doc " + i + ":\n" +firstHeader;

    // include first content with its index
    chunkString += `- [§${arr[0].chunk_index}] ${firstBody}`;

    // subsequent elements: only appendding content + index
    for (let i = 1; i < arr.length; i++) {
      const { chunk_index, text_chunk } = arr[i];
      const { body } = splitHeaderBody(text_chunk);
      chunkString += `\n- [§${chunk_index}] ${body}`;
    }

    result.push(chunkString);
  }

 

  return result;
}



// // ----------------------------------------------
// // Test data
// // ----------------------------------------------
// const chunks = [
//   {
//     doc_id: "journal26",
//     chunk_index: 1,
//     text_chunk:
//       "TITLE: journal26 DOCUMENT TYPE: patient_journal PATIENT NAME: Julie Bang CPR: 031092-2098 --- Present Illness: Patient reports insomnia and increased energy."
//   },
//   {
//     doc_id: "journal26",
//     chunk_index: 2,
//     text_chunk:
//       "TITLE: journal26 DOCUMENT TYPE: patient_journal PATIENT NAME: Julie Bang CPR: 031092-2098 --- Assessment: Findings consistent with manic episode."
//   },
//   {
//     doc_id: "guideline12",
//     chunk_index: 1,
//     text_chunk:
//       "TITLE: Pneumonia Guideline TYPE: nursing_guideline --- Overview: Manage fever, oxygen, and hydration."
//   },
//   {
//     doc_id: "guideline12",
//     chunk_index: 2,
//     text_chunk:
//       "TITLE: Pneumonia Guideline TYPE: nursing_guideline --- Escalate if respiratory distress or confusion."
//   }
// ];

// // ----------------------------------------------
// // Run + print
// // ----------------------------------------------
// const output = buildContext(chunks);
// console.log("=== Resulting Context Strings ===\n");
// console.log(output.join("\n\n"));
