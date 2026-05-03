export const code = `
#!/usr/bin/env node
/**
 * BOCKHAK KITCHEN SINK - TEST ALL 84 TAGS
 * Use this to verify SSR vs Client Hydration parity.
 */

import { Component } from 'react'; // moduleKeyword, namespace

/* blockComment: testing multi-line logic */
// lineComment: testing single line

/**
 * docComment: testing documentation tags
 * @param {string} text - docString
 */
export default class SyntaxTest extends Component {
  static priority = 10; // definitionKeyword, className, number
  
  #privateField = "internal"; // propertyName, string
  
  constructor(props) {
    super(props); // self, keyword
    this.state = {
      isValid: true,      // bool
      count: null,        // null
      pattern: /abc+/gi,  // regexp
      hex: 0xFF,          // integer
      price: 99.99,       // float
      list: [1, 2, 3]     // squareBracket, separator
    };
  }

  // function(variableName)
  async handleUpdate(event) {
    const { value } = event.target; // local(name), derefOperator
    
    // logicOperator, compareOperator
    if (value !== "" && this.state.isValid) {
      try {
        const result = await fetch(\`https://api.test.com/\${value}\`); // url, escape
        const data = await result.json();
        console.log("Success:", data); // standard(name)
      } catch (err) {
        throw new Error("Invalid"); // controlKeyword, atom
      }
    }
  }

  render() {
    // arithmeticOperator, updateOperator
    let score = (5 + 10) * 2;
    score++; 

    // JSX Logic (tagName, angleBracket, attributeName, attributeValue)
    return (
      <div className="container" data-test={true}>
        <h1 style={{ color: 'red' }}>Welcome to Bodhak</h1>
        <p>Testing {this.state.isValid ? "Valid" : "Invalid"}</p>
        
        {/* Component TagName (variableName + tagName) */}
        <CustomButton 
          label="Submit" 
          onClick={() => this.handleUpdate()} 
          isPrimary 
        />

        <br /> {/* Self-closing angleBracket */}
      </div>
    );
  }
}

// Bitwise and Type Operators
const mask = 0b1010 | 0b0101; 
const isNode = typeof process !== 'undefined'; // typeOperator

// Template literal with interpolation
const msg = \`Value is: \${score + 10}\`; // string, punctuation, brace
#!/usr/bin/env node
/* ^ processingInstruction / meta */

/**
 * docComment
 * @param {string} character - docString
 */
function specialTags() {
  // --- 1. Content & Markdown Tags ---
  // (Triggered if your editor is in Markdown mode or using a multi-lang parser)
  const markdownTest = \`
    # heading1
    ## heading2
    ### heading3
    ---
    contentSeparator
    * list item
    > quote
    **strong**
    *emphasis*
    ~~strikethrough~~
    [link](url)
    \`monospace\`
  \`;

  // --- 2. Operators & Types ---
  let count = 0;
  count++;          // updateOperator
  count += 1;       // updateOperator
  
  type User = {     // typeOperator (TS)
    id: integer;    // integer / typeName
    price: float;   // float / typeName
  };

  // --- 3. Special Literals & Values ---
  const styles = {
    color: "#ff0000",       // color
    width: "100px",         // unit
    background: "url(bg.png)" // url
  };

  const regex = /match\n/g; // escape (the \n)
  const char = 'A';         // character
}

// --- 4. Definitions & Scopes ---
const DEFAULT_CONFIG = "fixed"; // constant / definition
function initialize() {}        // function / definition

namespace Database {            // namespace
  export const local = "db";    // local
}

@annotation                     // annotation
class Controller {
  label:                        // labelName
  loop: while(true) break label;// labelName / controlOperator
}

// --- 5. Diff & Metadata ---
// (Triggered in Diff views)
// + inserted
// - deleted
// ! changed

// --- 6. Macro & Special ---
#define MACRO_NAME 10           // macroName
const invalid = @#$;            // invalid
const special = \f;             // special`