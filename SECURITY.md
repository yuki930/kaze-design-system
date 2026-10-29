# セキュリティポリシー

## サポートするバージョン

最新のマイナーバージョンのみ修正の対象です（0.x の間は最新リリースのみ）。

## 脆弱性の報告

脆弱性を見つけた場合は、公開の Issue ではなく GitHub の [Private vulnerability reporting](https://github.com/yuki930/kaze-design-system/security/advisories/new) から報告してください。受け取ってから 7 日以内に最初の返信をします。

このパッケージはランタイム依存を持たず、ブラウザ側の React コンポーネントと CSS だけを配布します。npm への公開は GitHub Actions の Trusted Publishing（OIDC）で行い、各バージョンに provenance が付いています。
