import { Inject, Injectable } from '@nestjs/common';
import { BrowserImpl, BROWSERS_TOKEN } from '@libs/application';

@Injectable()
export class PostWepollTask {
  constructor(
    @Inject(BROWSERS_TOKEN.CHROMIUM)
    private readonly chromiumService: BrowserImpl,
  ) {}

  async exec() {
    const page = await this.chromiumService.getPage();
    await page.goto('https://wepoll.kr/g2/bbs/write.php?bo_table=stock');

    // PHPSESSID, uid 값이면 됨.
    // 세션이라 뚫을 순 없을 같음.

    console.log(1);
  }
}
