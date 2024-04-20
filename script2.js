// tagProcessor.js
function processTag1(parsed_data) {
  let return_string = `Processed data for tag1: ${JSON.stringify(parsed_data)}`;
  console.log(return_string);
  return `Processed data for tag1: ${JSON.stringify(parsed_data)}`;
}

function processTag2(parsed_data) {
  let return_string = `Processed data for tag2: ${JSON.stringify(parsed_data)}`;
  console.log(return_string);
  return `Processed data for tag2: ${JSON.stringify(parsed_data)}`;
}

function processTag3(parsed_data) {
  let return_string = `Processed data for tag3: ${JSON.stringify(parsed_data)}`;
  console.log(return_string);
  return `Processed data for tag3: ${JSON.stringify(parsed_data)}`;
}

function processTag4(parsed_data) {
  let return_string = `Processed data for tag4: ${JSON.stringify(parsed_data)}`;
  console.log(return_string);
  return `Processed data for tag4: ${JSON.stringify(parsed_data)}`;
}


function parseInlineTag(tagString, tagname) {
  console.log(`parseInlineTag: ${tagString}, tagname: ${tagname}`);

  const tag_regex = new RegExp(`^<${tagname}\\s*(.*?)\/>$`);
  const matches = tagString.match(tag_regex);
  if (!matches) {
    throw new Error('Invalid tag format');
  }

  const tagName = matches[1];
  const rest = matches[2];
  const [argsPart, content] = rest.includes('|') ? rest.split('|').map(part => part.trim()) : [rest, ''];
  const args = argsPart.split(/\s+/);

  const result = {
    tagname: tagName,
    arguments: { content: content },
    id: null,
    class: null
  };

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

  return result;
}


function parseMultiLineTag(input, tagname) {
  console.log(`parseMultilineTag: ${input}, tagname: ${tagname}`);

  const tag_regex = new RegExp(`<${tagname}\\s*([^>]*)\\n([\\s\\S]*?)\\n/>`, 'm');
  const matches = input.match(tag_regex);
  if (!matches || matches.length < 3) {
    console.error('Failed to match or incomplete matches:', matches);
    throw new Error('Invalid tag format or incomplete data');
  }

  const argsPart = matches[1].trim();
  const content = matches[2].trim();  // Content is correctly assigned to matches[2]

  const args = argsPart.split(/\s+/);
  const result = {
    tagname: tagname,
    arguments: {
      content: content
    },
    id: null,
    class: null
  };

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

  return result;
}



const registered_tags = [
  {
    tagname: "tag1",
    tag_type: "inline",
    tag_parser: parseInlineTag,
    tag_processer: processTag1,
    tag_regex: new RegExp(`<${"tag1"}\\s*(.*?)\\/?>`, 'g')
  },
  {
    tagname: "tag2",
    tag_type: "inline",
    tag_parser: parseInlineTag,
    tag_processer: processTag2,
    tag_regex: new RegExp(`<${"tag2"}\\s*(.*?)\\/?>`, 'g')
  },
  {
    tagname: "tag3",
    tag_type: "multiline",
    tag_parser: parseMultiLineTag,
    tag_processer: processTag3,
    tag_regex: new RegExp(`<${"tag3"}\\s*([^>]*)\\n([\\s\\S]*?)\\n\\/?>`, 'gm')
  },
  {
    tagname: "tag4",
    tag_type: "inline",
    tag_parser: parseInlineTag,
    tag_processer: processTag4,
    tag_regex: new RegExp(`<${"tag4"}\\s*(.*?)\\/?>`, 'g')
  }
];



// function processTags(file_text) {

//   let processed_text = file_text;

//   // For each tag configuration, find and replace all occurrences in the text.
//   registered_tags.forEach(({ tagname, tag_parser, tag_processer, tag_regex }) => {
//     console.log(`tagname: ${tagname}, tag_parser: ${tag_parser.name}, tag_processer: ${tag_processer.name}, tag_regex: ${tag_regex}`);

//     processed_text = processed_text.replace(tag_regex, (match, g1, g2) => {
//       console.log(`match: ${match}`);
//       const parsed_data = tag_parser(match, tagname); // Make sure to pass tagname
//       console.log(`parsedData: ${JSON.stringify(parsed_data)}`);
//       return tag_processer(parsed_data);
//     });


//   });

//   return processed_text;
// }


function processTags(file_text) {
    let processed_text = file_text;

    registered_tags.forEach(({ tagname, tag_parser, tag_processer, tag_regex }) => {
        console.log(`Processing tags for: ${tagname}`);
        processed_text = processed_text.replace(tag_regex, (match, ...groups) => {
            console.log(`Match found for ${tagname}: ${match}`);
            const parsed_data = tag_parser(match, tagname);
            console.log(`Parsed data for ${tagname}: ${JSON.stringify(parsed_data)}`);
            return tag_processer(parsed_data);
        });
    });

    return processed_text;
}



let text = `
What is Lorem Ipsum?

Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever 
<tag3 main_argument +boolarg1 .class-1
This is content
This is more content
Even more content
/>
since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived <tag1 main_argument +boolean_arg1 -boolean_arg2 keyword_arg1=value #some-id .some-class | literal text content/> not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset <tag2 important-data +somearg +anotherarg kwarg=kwval anotherkey=anotherval #the-id .some-class .another-class | important information to go here that is text/> sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
`

console.log(processTags(text));
