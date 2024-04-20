function parseCustomTag(input) {
  // Trim the input to remove any leading or trailing whitespaces
  input = input.trim();

  // Regular expression to match the initial tag and its segments
  const tagRegex = /^<(\w+)\s*(.*?)\/>$/;
  const matches = input.match(tagRegex);

  if (!matches) {
      throw new Error('Invalid tag format');
  }

  // Extract tag name and the rest of the content
  const tagName = matches[1];
  const rest = matches[2];

  // Split at the pipe '|' if it exists to separate arguments from content
  const [argsPart, content] = rest.includes('|') ? rest.split('|').map(part => part.trim()) : [rest, ''];

  // Split arguments into individual components
  const args = argsPart.split(/\s+/);

  // Initialize the structure of the resulting object
  const result = {
      tagname: tagName,
      arguments: {
          content: content
      },
      id: null,
      class: null
  };

  // Process each argument
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
          // Assume it's the main argument if it's the first one
          if (!result.arguments.main) {
              result.arguments.main = arg;
          }
      }
  });

  return result;
}

// Example usage:
const input = '<sometag main_argument +boolean_arg1 -boolean_arg2 keyword_arg1=value #some-id .some-class | literal text content/>';
const parsedOutput = parseCustomTag(input);
console.log(JSON.stringify(parsedOutput));

fetch('text.txt')
.then(_ => _.text())
.then(_ => parseCustomTag(_))
.then(_ => console.log(_);


//<tag2 important-data +somearg +anotherarg kwarg=kwval anotherkey=anotherval #the-id .some-class .another-class | important information to go here that is text/> 