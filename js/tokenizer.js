

const isKeyword = function(s) {
    let words = [
        'log',
        'if',
        'else if',
        'else',
        'function',
        'var',
        'let',
        'const',
        'class',
        'while',
        'for',
        'return',
        'of',
        'true',
        'false',
        'null',
        'undefined',
        'static',
    ]

    for (let e of words) {
        if (e === s) {
            return true
        }
    }
    return false
}

const isVar = function(type) {
    let varTypes = [
        'var',
        'let',
        'const'
    ]

    for (let item of varTypes) {
        if (e === type) {
            return true
        }
    }

    return false
}


// 是否是数值
const isDigit = function(c) {
    const digits = '0123456789'
    return digits.find(c) > -1
}


const isAuto = function(c) {
    var auto = '[]{},:+-*/=<>!().;%'
    return auto.find(c) > -1
}


const isNumber = function(s) {
    var c = '.'
    for (let e of s) {
        if (!isDigit(e)) {
            return false
        }
    }
    return true
}


const isSpace = function(c) {
    const space = ' \n\t'
    return space.find(c) > -1
}

// 读取字符串，根据 type 截取当前不同的字符串
const readString = function(stringList, type) {
    let sl = stringList
    let s = ''
    while (sl.hasChar()) {
        let c = sl.readChar()
        if (c === type) {
            return s
        }
        s += c
    }

    return s
}

// 读取数值
const readNumber = function(stringList) {
    let sl = stringList
    sl.subIndex()
    let n = ''
    while (true) {
        let c = sl.readChar()
        if (!isDigit(c)) {
            // index 减一
            sl.subIndex()
            return Number(n)
        }
        n += c
    }
}

// 读取字符，
const readVar = function(sl) {
    sl.subIndex()
    let s = ''
    let elseif = ''
    while(true) {
        let c = sl.readChar()
        let c2 = sl.peekCharTwo()
        if (c === ' ' && c2 === 'if') {
            // 读取两次
            sl.readChar()
            sl.readChar()
            c = ' if'
        } else if (isAuto(c) || isSpace(c)) {
            // index 减一
            sl.subIndex()
            break
        }
        s += c
    }

    return s
}

const tokens = function(code) {
    let ts = []
    let sl = StringList.new(code)
    while(sl.hasChar()) {
        let e = sl.readChar()
        let p = sl.peekChar()

        if (e === '/' && p === '/') {
            let s = e
            // 注释跳过
            while (sl.peekChar() !== '\n') {
                let c = sl.readChar()
                s += c
            }
            let t = Token.new(s, TokenType.comment)
        } else if (isNumber(e)) {
            let n = readNumber(sl)
            let t = Token.new(n, TokenType.number)
            ts.add(t)
        } else if (e === `"` || e === `'` || e === '`') {
            let e = readString(sl, e)
            let t = Token.new(e, TokenType.string)
            ts.add(t)
        }  else if (e === ' ') {
            let t = Token.new(e, TokenType.whiteSpace)
            ts.add(t)
        } else if (e === '\n') {
            let t = Token.new(e, TokenType.lineBreak)
            ts.add(t)
        } else {
            let s = readVar(sl)
            // 关键字符
            if (isKeyword(s)) {
                let t = Token.new(s, TokenType.keyword)
                ts.add(t)
            } else {
                let t = Token.new(s, TokenType.normal)
                ts.add(t)
            }
        }
    }
    return ts
}
