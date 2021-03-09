#  @naro/agroenv-search-api

## development

```shell
$ git clone git@github.com:geolonia/naro-agroenv-search-api.git
$ cd naro-agroenv-search-api
$ cp .envrc.sample .envrc
$ vim .envrc # fill the values
$ yarn # or `npm install`
$ npm test
```

### start localserver

```shell
$ npm start
```

### build js library

```shell
$ npm run build:lib
```

## deploy

```shell
$ npm run deploy:dev
```

## 抽出スクリプト

```typescript
type Option = {
  startYear: number; // 開始年
  endYear?: number; // 終了年
  startYear?: number; // 開始月
  endMonth?: number; // 終了月
  gridcodes: string[]; // 3次メッシュコードの配列
  endpointFormat?: string; // エンドポイントのフォーマット。デフォルトでは GitHub Pages での静的配信 API を指定
}

type AgroEnvData = {
  gridcode: string; // 3次メッシュコード
  year: number;
  month: number;
  day: number;
  tm: number;
  pr: number;
  tn: number;
  sr: number;
  tx: number;
  sd: number;
}

type QueryAgroEnvData = (option: Option) => Promise<AgroEnvData[]>

declare global {
  interface Window {
    queryAgroEnvData: QueryAgroEnvData;
  }
}
```

### 使用例

```javascript
const option = {
  startYear: 2005,
  startMonth: 2,
  endYear: 2007,
  endMonth: 10,
  gridcodes: ['11111111', '11111112'],
  endpointFormat: 'https://example.com/%s/%s/%s/%s.json' // [year,1次メッシュコード,2次メッシュコード,3次メッシュコード]という形でフォーマットされる
}
window.queryAgroEnvData(option).then(data => {
  // 2005/02 - 2007/10 の、 11111111と11111112 のメッシュコードのデータが得られる
})
```
