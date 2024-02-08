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

log.user.[you_function] :
```

### group

#### `log.group()`

display all group exists in logger config

#### `log.group.get(a:number,b:number?)`

display group from a to b

#### `log.group.get().set(override:boolean)`

group will override status when same group is loaded

```javascript
//example
display:{
  main: string,
  groups:{
    0: {
      override: true
    },
    // don't need to set all of property, default will be false
  },
  ...
}
```

이거 그룹 포맷 없애고 message displayFormat에서 다 사용하는 걸로 함

그리고 추가적으로 status displayFormat도 만들어야함

### date

#### `log.date.format`

print date with format

#### `log.date.set`

set date info before print date

### message

#### `log.message`

this will log message that you put in function

```javascript
// <% log.message %> : testing message
logger.log("testing message");
```

### time

#### `log.time`

this will return logger running time until resolved

<div style="padding: 15px; border: 1px solid transparent; border-color: transparent; margin-bottom: 20px; border-radius: 4px; color: #8a6d3b;; background-color: #fcf8e3; border-color: #faebcc;">
<b>[WARN!]</b> ONLY IN PROMISE MODE ONLY!
</div>

### custom function

#### `log.user.[your_function]`

user custom function or class instance

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

```
//function activation sequence
- message format
  - group format
    - status format
    - internal sequence
    - callback
    - group format
```
