let input = document.getElementById("input");
let output = document.getElementById("output");
let regex = /([0-9]*[.]?[0-9]*)?([^0-9.])?/g;
let BLACKLIST = [" ", "", undefined];
let WHITELIST = ["+", "-", "*", "/"];

function operate(leftVar, rightVar, opReg, rightNeg, leftNeg) {
  leftVar = parseFloat(leftVar);
  rightVar = parseFloat(rightVar);
  if (leftNeg)
    leftVar *= -1;
  if (rightNeg)
    rightVar *= -1;
  switch (opReg) {
    case "+":
      return leftVar + rightVar;
    case "-":
      return leftVar - rightVar;
    case "*":
      return leftVar * rightVar;
    case "/":
      return leftVar / rightVar;
  }
}

function parse() {
  let leftVar = null, rightVar = null, opReg = null, rightNeg = false, leftNeg = false;
  let invalidTokens = [];
  Array.from(input.value).forEach((token) => {
    if (isNaN(token) && !WHITELIST.includes(token))
      invalidTokens.push(token);
  });
  if (invalidTokens.length != 0) {
    alert(`Invalid tokens: ${invalidTokens.toString()}`);
    return;
  }
  let tokens = input.value.split(regex);
  tokens = tokens.filter((str) => !BLACKLIST.includes(str));
  //BODMAS
  let orderOfOps = ["/*", "+-"];
  for (order of orderOfOps) {
    leftVar = rightVar = opReg = null, rightNeg = leftNeg = false;
    let newTokens = [];
    for (token of tokens) {
      if (!isNaN(token)) {
        if (leftVar === null) {
          leftVar = token;
        } else if (opReg !== null) {
          rightVar = token;
          //If incorrect order, dump leftVar, leftNeg and opReg
          if (!order.includes(opReg)) {
            if (leftNeg)
              newTokens.push("-");
            newTokens.push(leftVar);
            newTokens.push(opReg);
            leftVar = rightVar;
            leftNeg = rightNeg;
            rightVar = null, opReg = null, rightNeg = false;
          } else {
            //Right register filled, do operation then clean
            leftVar = operate(leftVar, rightVar, opReg, rightNeg, leftNeg);
            rightVar = null, opReg = null, rightNeg = false, leftNeg = false;
          }
        } else {
          alert("SYNTAX ERROR, ABORTING\nReason: Numbers not connected w/ operator");
          return;
        }
      } else if (typeof token === "string") {
        if (token === "-") {
          if (leftVar === null) {
            leftNeg = !leftNeg;
          } else if (opReg === null) {
            opReg = token;
          } else {
            rightNeg = !rightNeg;
          }
        } else if (leftVar !== null && opReg === null) {
          opReg = token;
        } else if (leftVar === null) {
          alert(`SYNTAX ERROR, ABORTING\nReason: "${token}" is missing a number on the left side`);
          return
        } else if (opReg !== null) {
          alert("SYNTAX ERROR, ABORTING\nReason: Two operators next to each other");
          return;
        }
      } else {
        alert("SYNTAX ERROR, ABORTING\nReason: Unknown token type");
        return;
      }
    }
    if (!(orderOfOps.lastIndexOf() == orderOfOps.indexOf(order))) {
      
      if (leftNeg)
        newTokens.push("-");
      newTokens.push(leftVar);
    }
    tokens = newTokens;
  }
  if (rightVar !== null || opReg !== null || leftNeg || rightNeg) {
    alert(`SYNTAX ERROR, ABORTING\nReason: End of expression not complete\n
    Vars: rightVar: ${rightVar !== null} opReg: ${opReg !== null} 
    leftNeg: ${leftNeg} rightNeg: ${rightNeg}`);
    return;
  }
  output.innerText = leftVar;
}