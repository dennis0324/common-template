// template basic principle
const regex = new RegExp(/<%(?:-|_)?\s*[*~]{0,1}((?:.|\s)*?)(?:-|_)?%>/g);
const regex2 = new RegExp(/[.*+?^&{}()|[\]\\]/g);
const content = `<%*
log.print()
return 1;
%>
asdf`

class test {
  num = 1;
  testMethod() { this.num++; }
  print() { console.log(this.num) }
}

const a = new test();

let match;
const parsed = {
  args : [],
  code : []
};
while ((match = regex.exec(content)) !== null) {
  parsed.code.push(match[1]);
}

function run_function(parsed)
{

  for (let code of parsed.code) {

    const asdf = new Function('log', code)(a);
    console.log(asdf);
  }
}

// run_function(parsed);

// TODO: need to migrate dayjs to indepent package

// function information
// log.status -> get_status(decorator)
//
// log.date -> get_date() use dayjs
// log.format -> day with format
// or just give dayjs constructer to use
//

// log.date.format
//
//
