import axios from 'axios';

// @todo pdf path
// https://bbn.kiwoom.com/research/SPdfFileView?rMenuGb=CC&attaFile=1732694758852.pdf&makeDt=2024.11.27
describe('kiwoom-crawler', () => {
  beforeEach(() => {
    process.env.AWS_PROFILE = 'dev';
    process.env.AWS_PROFILEAWS_SDK_LOAD_CONFIG = '1';
  });

  it('list', async () => {
    const form = new FormData();
    form.append('pageNo', '1');
    form.append('stdate', '20240601');
    form.append('eddate', '20241201');
    form.append('f_keyField', '');
    form.append('f_key', '');
    form.append('_reqAgent', 'ajax');

    const response = await axios.post(
      'https://bbn.kiwoom.com/research/SResearchCCListAjax',
      form,
    );

    console.log(1);
  });
});
