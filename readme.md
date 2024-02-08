# usage guide

```
<% ... %> to execute bellow command

log.group: display all group
log.group(a:number,b:number?): display  a to b
log.date: display "now" date
log.date.format: print date with format
log.date.set: print after setting date info
log.message : log message that you put in function ex) log("testing message") -> testing message
log.time : print logger running time (notice: ONLY IN PROMISE MODE)

log.status: show array of status

log.name: return value of status (only in status)

log.user.[you_function] : user custom function or class instance
```

```ts
[statusname]:{
  group: 0,                                 // needed: default: 0
  colorCode:chalk.blue.bgRed,               // type: chalkInstance(ex)  optional: default: default
  status: [ "oh Yes [<% log.name %>]" ],  // optional default: [<% log.status %>]
  isPromise: false,                         // optional default: false
  // hidden property

}

```

```ts
 // logger setting

display:{
  main: string //ex) "<% group0 %> <% message %> <% group(1) %>",
  groups:{
    0: {
   override: true

   }
  }
}
```
