import { util } from './util';

// 音乐下载
export default class downMusic {
  constructor(name = '暂无') {
    this.procent = 0;
    this.name = name;
    this.randomStr = util.randomStr();
  }

  over() {}
}
