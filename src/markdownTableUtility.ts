

/**
* 1行分の文字列を列データ配列に分解する
* 指定した列数に満たない行は 埋め文字 で埋める
* @param linestr 1行分の文字列
* @param columnNum 列数
* @param fillstr 埋め文字
*/
export function splitline(linestr: string, columnNum: number, fillstr: string = '') {
    // 先頭と末尾の|を削除
    linestr = linestr.trim();
    if (linestr.startsWith('|')) {
        linestr = linestr.slice(1);
    }
    if (linestr.endsWith('|')) {
        linestr = linestr.slice(0, -1);
    }

    // |で分割
    let linedatas: string[] = [];
    let startindex = 0;
    let endindex = 0;
    let isEscaping = false;
    let isInInlineCode = false;
    for (let i = 0; i < linestr.length; ++i) {
        if (isEscaping) {
            // エスケープ文字の次の文字は|かどうか判定しない
            isEscaping = false;
            endindex++;
            continue;
        }

        const chara = linestr.charAt(i);
        if (chara === '\`') {
            // `の間はインラインコード
            isInInlineCode = !isInInlineCode;
            endindex++;
            continue;
        }
        if (isInInlineCode) {
            // インラインコード中は|かどうか判定しない
            endindex++;
            continue;
        }

        if (chara === '\\') {
            // \はエスケープ文字
            isEscaping = true;
            endindex++;
            continue;
        }

        if (chara !== '|') {
            // | 以外だったら継続
            endindex++;
            continue;
        }

        // | だったら分割
        let cellstr = linestr.slice(startindex, endindex);
        linedatas.push(cellstr);
        startindex = i + 1;
        endindex = i + 1;
    }
    linedatas.push(linestr.slice(startindex));

    // データ数分を''で埋めておく
    let datas: string[] = new Array(columnNum).fill(fillstr);
    // 行文字列から取得したデータに置き換える
    for (let i = 0; i < linedatas.length; i++) {
        datas[i] = linedatas[i];
    }
    return datas;
};



// 半角文字は1文字、全角文字は2文字として文字数をカウントする
export function getLen(str: string): number {
    let length = 0;
    for (let i = 0; i < str.length; i++) {
        let chp = str.codePointAt(i);
        if (chp === undefined) {
            continue;
        }
        let chr = chp as number;
        if (doseUseEAW2Spaces(chr)) {
            // EAW 2
            length += 2;
        } else if (doesUse0Space(chr)) {
            length += 0;
        }
        else if (doesUse3Spaces(chr)) {
            length += 3;
        }
        else if (doesUse2Spaces(chr)) {
            // 全角文字の場合は2を加算
            length += 2;
        }
        else {
            //それ以外の文字の場合は1を加算
            length += 1;
        }

        let chc = str.charCodeAt(i);
        if (chc >= 0xD800 && chc <= 0xDBFF) {
            // サロゲートペアの時は1文字読み飛ばす
            i++;
        }

        // if( (chr >= 0x00 && chr <= 0x80) ||
        //     (chr >= 0xa0 && chr <= 0xff) ||
        //     (chr === 0xf8f0) ||
        //     (chr >= 0xff61 && chr <= 0xff9f) ||
        //     (chr >= 0xf8f1 && chr <= 0xf8f3)){
        //     //半角文字の場合は1を加算
        //     length += 1;
        // }else{
        //     //それ以外の文字の場合は2を加算
        //     length += 2;
        // }
    }
    //結果を返す
    return length;
};

function doesUse0Space(charCode: number): boolean {
    if ((charCode === 0x02DE) ||
        (charCode >= 0x0300 && charCode <= 0x036F) ||
        (charCode >= 0x0483 && charCode <= 0x0487) ||
        (charCode >= 0x0590 && charCode <= 0x05CF)) {
        return true;
    }
    return false;
}

function doesUse2Spaces(charCode: number): boolean {
    if ((charCode >= 0x2480 && charCode <= 0x24FF) ||
        (charCode >= 0x2600 && charCode <= 0x27FF) ||
        (charCode >= 0x2900 && charCode <= 0x2CFF) ||
        (charCode >= 0x2E00 && charCode <= 0xFF60) ||
        (charCode >= 0xFFA0)) {
        return true;
    }
    return false;
}

function doesUse3Spaces(charCode: number): boolean {
    if (charCode >= 0x1F300 && charCode <= 0x1FBFF) {
        return true;
    }
    return false;
}
function doseUseEAW2Spaces(codePoint: number): boolean {
  if ((0x00A1 === codePoint) ||
      (0x00A4 === codePoint) ||
      (0x00A7 <= codePoint && codePoint <= 0x00A8) ||
      (0x00AA === codePoint) ||
      (0x00AD <= codePoint && codePoint <= 0x00AE) ||
      (0x00B0 <= codePoint && codePoint <= 0x00B4) ||
      (0x00B6 <= codePoint && codePoint <= 0x00BA) ||
      (0x00BC <= codePoint && codePoint <= 0x00BF) ||
      (0x00C6 === codePoint) ||
      (0x00D0 === codePoint) ||
      (0x00D7 <= codePoint && codePoint <= 0x00D8) ||
      (0x00DE <= codePoint && codePoint <= 0x00E1) ||
      (0x00E6 === codePoint) ||
      (0x00E8 <= codePoint && codePoint <= 0x00EA) ||
      (0x00EC <= codePoint && codePoint <= 0x00ED) ||
      (0x00F0 === codePoint) ||
      (0x00F2 <= codePoint && codePoint <= 0x00F3) ||
      (0x00F7 <= codePoint && codePoint <= 0x00FA) ||
      (0x00FC === codePoint) ||
      (0x00FE === codePoint) ||
      (0x0101 === codePoint) ||
      (0x0111 === codePoint) ||
      (0x0113 === codePoint) ||
      (0x011B === codePoint) ||
      (0x0126 <= codePoint && codePoint <= 0x0127) ||
      (0x012B === codePoint) ||
      (0x0131 <= codePoint && codePoint <= 0x0133) ||
      (0x0138 === codePoint) ||
      (0x013F <= codePoint && codePoint <= 0x0142) ||
      (0x0144 === codePoint) ||
      (0x0148 <= codePoint && codePoint <= 0x014B) ||
      (0x014D === codePoint) ||
      (0x0152 <= codePoint && codePoint <= 0x0153) ||
      (0x0166 <= codePoint && codePoint <= 0x0167) ||
      (0x016B === codePoint) ||
      (0x01CE === codePoint) ||
      (0x01D0 === codePoint) ||
      (0x01D2 === codePoint) ||
      (0x01D4 === codePoint) ||
      (0x01D6 === codePoint) ||
      (0x01D8 === codePoint) ||
      (0x01DA === codePoint) ||
      (0x01DC === codePoint) ||
      (0x0251 === codePoint) ||
      (0x0261 === codePoint) ||
      (0x02C4 === codePoint) ||
      (0x02C7 === codePoint) ||
      (0x02C9 <= codePoint && codePoint <= 0x02CB) ||
      (0x02CD === codePoint) ||
      (0x02D0 === codePoint) ||
      (0x02D8 <= codePoint && codePoint <= 0x02DB) ||
      (0x02DD === codePoint) ||
      (0x02DF === codePoint) ||
      (0x0300 <= codePoint && codePoint <= 0x036F) ||
      (0x0391 <= codePoint && codePoint <= 0x03A1) ||
      (0x03A3 <= codePoint && codePoint <= 0x03A9) ||
      (0x03B1 <= codePoint && codePoint <= 0x03C1) ||
      (0x03C3 <= codePoint && codePoint <= 0x03C9) ||
      (0x0401 === codePoint) ||
      (0x0410 <= codePoint && codePoint <= 0x044F) ||
      (0x0451 === codePoint) ||
      (0x2010 === codePoint) ||
      (0x2013 <= codePoint && codePoint <= 0x2016) ||
      (0x2018 <= codePoint && codePoint <= 0x2019) ||
      (0x201C <= codePoint && codePoint <= 0x201D) ||
      (0x2020 <= codePoint && codePoint <= 0x2022) ||
      (0x2024 <= codePoint && codePoint <= 0x2027) ||
      (0x2030 === codePoint) ||
      (0x2032 <= codePoint && codePoint <= 0x2033) ||
      (0x2035 === codePoint) ||
      (0x203B === codePoint) ||
      (0x203E === codePoint) ||
      (0x2074 === codePoint) ||
      (0x207F === codePoint) ||
      (0x2081 <= codePoint && codePoint <= 0x2084) ||
      (0x20AC === codePoint) ||
      (0x2103 === codePoint) ||
      (0x2105 === codePoint) ||
      (0x2109 === codePoint) ||
      (0x2113 === codePoint) ||
      (0x2116 === codePoint) ||
      (0x2121 <= codePoint && codePoint <= 0x2122) ||
      (0x2126 === codePoint) ||
      (0x212B === codePoint) ||
      (0x2153 <= codePoint && codePoint <= 0x2154) ||
      (0x215B <= codePoint && codePoint <= 0x215E) ||
      (0x2160 <= codePoint && codePoint <= 0x216B) ||
      (0x2170 <= codePoint && codePoint <= 0x2179) ||
      (0x2189 === codePoint) ||
      (0x2190 <= codePoint && codePoint <= 0x2199) ||
      (0x21B8 <= codePoint && codePoint <= 0x21B9) ||
      (0x21D2 === codePoint) ||
      (0x21D4 === codePoint) ||
      (0x21E7 === codePoint) ||
      (0x2200 === codePoint) ||
      (0x2202 <= codePoint && codePoint <= 0x2203) ||
      (0x2207 <= codePoint && codePoint <= 0x2208) ||
      (0x220B === codePoint) ||
      (0x220F === codePoint) ||
      (0x2211 === codePoint) ||
      (0x2215 === codePoint) ||
      (0x221A === codePoint) ||
      (0x221D <= codePoint && codePoint <= 0x2220) ||
      (0x2223 === codePoint) ||
      (0x2225 === codePoint) ||
      (0x2227 <= codePoint && codePoint <= 0x222C) ||
      (0x222E === codePoint) ||
      (0x2234 <= codePoint && codePoint <= 0x2237) ||
      (0x223C <= codePoint && codePoint <= 0x223D) ||
      (0x2248 === codePoint) ||
      (0x224C === codePoint) ||
      (0x2252 === codePoint) ||
      (0x2260 <= codePoint && codePoint <= 0x2261) ||
      (0x2264 <= codePoint && codePoint <= 0x2267) ||
      (0x226A <= codePoint && codePoint <= 0x226B) ||
      (0x226E <= codePoint && codePoint <= 0x226F) ||
      (0x2282 <= codePoint && codePoint <= 0x2283) ||
      (0x2286 <= codePoint && codePoint <= 0x2287) ||
      (0x2295 === codePoint) ||
      (0x2299 === codePoint) ||
      (0x22A5 === codePoint) ||
      (0x22BF === codePoint) ||
      (0x2312 === codePoint) ||
      (0x2460 <= codePoint && codePoint <= 0x24E9) ||
      (0x24EB <= codePoint && codePoint <= 0x254B) ||
      (0x2550 <= codePoint && codePoint <= 0x2573) ||
      (0x2580 <= codePoint && codePoint <= 0x258F) ||
      (0x2592 <= codePoint && codePoint <= 0x2595) ||
      (0x25A0 <= codePoint && codePoint <= 0x25A1) ||
      (0x25A3 <= codePoint && codePoint <= 0x25A9) ||
      (0x25B2 <= codePoint && codePoint <= 0x25B3) ||
      (0x25B6 <= codePoint && codePoint <= 0x25B7) ||
      (0x25BC <= codePoint && codePoint <= 0x25BD) ||
      (0x25C0 <= codePoint && codePoint <= 0x25C1) ||
      (0x25C6 <= codePoint && codePoint <= 0x25C8) ||
      (0x25CB === codePoint) ||
      (0x25CE <= codePoint && codePoint <= 0x25D1) ||
      (0x25E2 <= codePoint && codePoint <= 0x25E5) ||
      (0x25EF === codePoint) ||
      (0x2605 <= codePoint && codePoint <= 0x2606) ||
      (0x2609 === codePoint) ||
      (0x260E <= codePoint && codePoint <= 0x260F) ||
      (0x2614 <= codePoint && codePoint <= 0x2615) ||
      (0x261C === codePoint) ||
      (0x261E === codePoint) ||
      (0x2640 === codePoint) ||
      (0x2642 === codePoint) ||
      (0x2660 <= codePoint && codePoint <= 0x2661) ||
      (0x2663 <= codePoint && codePoint <= 0x2665) ||
      (0x2667 <= codePoint && codePoint <= 0x266A) ||
      (0x266C <= codePoint && codePoint <= 0x266D) ||
      (0x266F === codePoint) ||
      (0x269E <= codePoint && codePoint <= 0x269F) ||
      (0x26BE <= codePoint && codePoint <= 0x26BF) ||
      (0x26C4 <= codePoint && codePoint <= 0x26CD) ||
      (0x26CF <= codePoint && codePoint <= 0x26E1) ||
      (0x26E3 === codePoint) ||
      (0x26E8 <= codePoint && codePoint <= 0x26FF) ||
      (0x273D === codePoint) ||
      (0x2757 === codePoint) ||
      (0x2776 <= codePoint && codePoint <= 0x277F) ||
      (0x2B55 <= codePoint && codePoint <= 0x2B59) ||
      (0x3248 <= codePoint && codePoint <= 0x324F) ||
      (0xE000 <= codePoint && codePoint <= 0xF8FF) ||
      (0xFE00 <= codePoint && codePoint <= 0xFE0F) ||
      (0xFFFD === codePoint) ||
      (0x1F100 <= codePoint && codePoint <= 0x1F10A) ||
      (0x1F110 <= codePoint && codePoint <= 0x1F12D) ||
      (0x1F130 <= codePoint && codePoint <= 0x1F169) ||
      (0x1F170 <= codePoint && codePoint <= 0x1F19A) ||
      (0xE0100 <= codePoint && codePoint <= 0xE01EF) ||
      (0xF0000 <= codePoint && codePoint <= 0xFFFFD) ||
      (0x100000 <= codePoint && codePoint <= 0x10FFFD)) {
    return true;
  }

  return false;
}
