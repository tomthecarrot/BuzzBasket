# LogJS

## Installation
```bash
npm install --save @samr28/log
```

## Usage
```js
const l = include ("@samr28/log");

// Turn logging on (default: off)
l.on();

// Turn logging off (default: off)
l.off();

// Turn off color (default: on)
l.color(false);

// Turn off date for log messages (default: on)
l.date(false);

l.log("Error message", "error");
l.log("Warming message", "warning");
l.log("Info message", "info");
```

## Default message types
The second parameter of `log()` is the message type. Below is a list of the types that are initially provided. To add custom types, see the "Advanced Usage" section.

```
ERROR:      red
SUCCESS:    green
WARNING:    yellow
INFO:       cyan
```

*These types are not case sensitive and will automatically formatted in log messages.*

## Advanced usage

To set your own message types, see the example below:

```js
l.setColors({
    typeOne: "RED",
    imBlue: "blue",
    grenyay: "gREeN"
});

l.on();

// [TypeOne] My message
l.log("My message", "typeOne");

// [ImBlue] another message
l.log("another message", "imblue");

// [Greenyay] yeet
l.log("yeet", "greenyay");
```

*These types are not case sensitive and will automatically formatted in log messages.*