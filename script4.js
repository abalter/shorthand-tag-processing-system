function parseDollarTag(tagString) {
    // Regular expression to match the custom tag format
    const tagRegex = /<\$\s+([^>]+)\/>/;
    const matches = tagString.match(tagRegex);
    if (!matches) {
        console.error('Failed to parse the dollar tag:', tagString);
        throw new Error('Invalid tag format');
    }

    // Capture the arguments
    const args = matches[1].trim().split(/\s+/);

    // Constructing the result object
    const result = {
        tagname: "$",
        arguments: args
    };

    return result;
}


function processDollarTag(data) {
    return `Processed Dollar Tag with arguments: ${JSON.stringify(data.arguments)}`;
}


const registeredTags = [
  // Existing tag configurations...
  {
    tagname: "$",
    parser: parseDollarTag,
    processor: processDollarTag
  }
];

function processTags(file_text) {
  registeredTags.forEach(tag => {
    const regex = new RegExp(`<\\${tag.tagname}\\s[^>]+\\/?>`, 'g');
    file_text = file_text.replace(regex, match => {
      const parsedData = tag.parser(match);
      return tag.processor(parsedData);
    });
  });
  return file_text;
}

// Test string with the new dollar tag format
let file_text = `Here is a normal text and here comes the tag: <$ a b c /> more text follows.`;

console.log(processTags(file_text));
