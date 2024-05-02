function parseInlineTag(tagString) {
  const tagRegex = /<(\w+)\s+([^|>]+)\|?\s*([^>]*)\/>/;
  const matches = tagString.match(tagRegex);
  if (!matches) {
    console.error('Failed to parse tag:', tagString);
    throw new Error('Invalid tag format');
  }

  const tagName = matches[1];
  const argsPart = matches[2].trim();
  const content = (matches[3] || '').trim();

  const result = {
    tagname: tagName,
    arguments: {},
    id: null,
    class: null
  };

  const args = argsPart.split(/\s+/);
  args.forEach(arg => {
    if (arg.startsWith('+')) {
      result.arguments[arg.substring(1)] = true;
    } else if (arg.startsWith('-')) {
      result.arguments[arg.substring(1)] = false;
    } else if (arg.includes('=')) {
      const [key, value] = arg.split('=');
      result.arguments[key] = value;
    } else if (arg.startsWith('.')) {
      result.class = arg.substring(1);
    } else if (arg.startsWith('#')) {
      result.id = arg.substring(1);
    } else {
      if (!result.arguments.main) {
        result.arguments.main = arg;
      }
    }
  });

  result.arguments.content = content;
  return result;
}

function parseMultiLineTag(tagString) {
  const tagRegex = /<(\w+)\s+([^>\n]+)((?:\n[^>]*)+)\n\/>/;
  const matches = tagString.match(tagRegex);
  if (!matches) {
    console.error('Failed to parse multi-line tag:', tagString);
    throw new Error('Invalid tag format for multi-line');
  }

  const tagName = matches[1];
  const argsPart = matches[2].trim();
  const content = (matches[3] || '').trim();

  const result = {
    tagname: tagName,
    arguments: {},
    id: null,
    class: null
  };

  const args = argsPart.split(/\s+/);
  args.forEach(arg => {
    if (arg.startsWith('+')) {
      result.arguments[arg.substring(1)] = true;
    } else if (arg.startsWith('-')) {
      result.arguments[arg.substring(1)] = false;
    } else if (arg.includes('=')) {
      const [key, value] = arg.split('=');
      result.arguments[key] = value;
    } else if (arg.startsWith('.')) {
      result.class = arg.substring(1);
    } else if (arg.startsWith('#')) {
      result.id = arg.substring(1);
    } else {
      if (!result.arguments.main) {
        result.arguments.main = arg;
      }
    }
  });

  result.arguments.content = content;
  return result;
}

function parseDollarTag(tagString) {
  // Regular expression to match the custom tag format
  const tagRegex = /<\$\s+([^>]+)\/>/;
  const matches = tagString.match(tagRegex);
  if (!matches) {
    console.error('Failed to parse the dollar tag:', tagString);
    throw new Error('Invalid tag format');
  }

  // Capture the arguments
  const content = matches[1].trim().split(/\s+/);

  // Constructing the result object
  const result = {
    tagname: "$",
    arguments: { content: content }
  };

  return result;
}

function parsePercentTag(tagString) {
  // Regular expression to match the custom tag format
  const tagRegex = /<\%\s+([^>]+)\/>/;
  const matches = tagString.match(tagRegex);
  if (!matches) {
    console.error('Failed to parse the dollar tag:', tagString);
    throw new Error('Invalid tag format');
  }

  // Capture the arguments
  const args =
    matches[1]
      .trim();
  // .split(/\s+/);

  // Constructing the result object
  const result = {
    tagname: "%",
    arguments: args
  };

  return result;
}


function processTag1(data) {
  return `Processed Tag1: ${JSON.stringify(data)}`;
}

function processTag2(data) {
  return `Processed Tag2: ${JSON.stringify(data)}`;
}

function processTag3(data) {
  return `Processed Tag3: ${JSON.stringify(data)}`;
}

function processDollarTag(data) {
  return `\\(${data.arguments.content}\\)`;
}

function processPercentTag(data) {
  return `Processed % Tag with arguments: ${JSON.stringify(data.arguments)}`;
}

const registeredTags = [
  {
    tagname: "tag1",
    parser: parseInlineTag,  // For inline tags
    processor: processTag1
  },
  {
    tagname: "tag2",
    parser: parseInlineTag,  // For inline tags
    processor: processTag2
  },
  {
    tagname: "tag3",
    parser: parseMultiLineTag,  // For multi-line tags
    processor: processTag3
  },
  {
    tagname: "$",
    parser: parseDollarTag,
    processor: processDollarTag
  },
  {
    tagname: "%",
    parser: parsePercentTag,
    processor: processPercentTag
  }
];;

// Function to escape special characters in regex patterns
function escapeRegex(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

// Updated processTags function to use a single regex pattern for any tag
function processTags(file_text) {
  registeredTags.forEach(tag => {
    // Escape special characters in the tag name
    const escapedTagName = escapeRegex(tag.tagname);

    // General regex that works with any tag name including special characters
    const regex = new RegExp(`<${escapedTagName}\\s[\\s\\S]*?\\/?>`, 'g');

    file_text = file_text.replace(regex, match => {
      const parsedData = tag.parser(match);
      return tag.processor(parsedData);
    });
  });
  return file_text;
}

// Updated test string with multi-line content
let file_text = `words words words <tag1 main_argument +boolean_arg1 -boolean_arg2 key=value #id .class | Here is some content /> more words more 
<tag3 main_argument +boolarg1 .class-1
This is content
This is more content
Even more content
/>
words more words <tag2 anotherArg +flag1 -flag2 key2=val2 #anotherId .anotherClass | Additional content here/> words words words`;

file_text = `
What is Lorem Ipsum?

Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever 
<tag3 main_argument +boolarg1 .class-1
This is content
This is more content
Even more content
/>
since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has  <% a b c /> survived <tag1 main_argument +boolean_arg1 -boolean_arg2 keyword_arg1=value #some-id .some-class | literal text content/> not only five centuries, but also the <$ \sqrt{2 \pi \sigma^2}/> leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset <tag2 important-data +somearg +anotherarg kwarg=kwval anotherkey=anotherval #the-id .some-class .another-class | important information to go here that is text/> sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
`;

// file_text = `Here is a normal text and here comes the tag: <$ a b c /> more text follows.`;

// console.log(processTags(file_text));

// fetch('text.txt')
// .then(_ => _.text())
// .then(_ => processTags(_))
// .then(_ => console.log(_));


let x = await fetch('text.txt').then(_ => _.text());
console.log(`x: ${x}`);
x = processTags(x);
console.log(x);

