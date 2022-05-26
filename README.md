# auto-ticket-issuer

Sample project creating a Backlog ticket when a GitHub Pull Request is opened.

## 開発方法

### Clasp をグローバルインストールしてログイン

```shell
npm i -g @google/clasp

clasp login
```

### プロジェクトルートで依存パッケージをインストール

```shell
npm i
```

### スクリプトを作成

```shell
clasp create --type webapp --title "@kzmshx/auto-ticket-issuer" --rootDir "src"
```

### `.clasp.json` をプロジェクトルートへ移動

```shell
mv src/.clasp.json .clasp.json
```

### `appsscript.json` の `timezone` を変更

```text
{
  "timeZone": "Asia/Tokyo",
  ...
}
```

### コードをプッシュ

```shell
clasp push
```

### ウェブアプリケーションとしてデプロイ

### 更新された `appsscript.json` をローカルへダウンロード

→ 環境構築終了