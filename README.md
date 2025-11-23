# 🎯 Git & GitHub CLI Wizard

**Git と GitHub CLI の操作をビジュアルに学べるインタラクティブ学習ツール**

コマンドラインが苦手な方でも安心！Git と GitHub CLI のコマンドを安全に、簡単に、わかりやすく学べるHTML5ベースのWebアプリケーションです。

## ✨ 主な機能

### 📝 1. コマンド解析・解説
- **コマンドを貼り付けるだけで詳細解説**
  - 各部分の意味を分かりやすく説明
  - 実行するとどうなるか事前に確認
  - 危険度を4段階で評価（安全・注意・危険・非常に危険）

- **🚨 重要な警告機能**
  - **Fork元への誤Push検出**: upstream へのプッシュを検出して警告
  - **強制プッシュ警告**: `--force` の危険性を説明
  - **メインブランチへの直接Push警告**: より良いワークフローを提案
  - **破壊的操作の警告**: `reset --hard`, `clean -f` などの危険なコマンドを検出

- **より良い代替案を提案**
  - 安全な方法を自動的に提案
  - 正しいコマンドの例を表示

- **元に戻す方法も表示**
  - 万が一のための復旧方法を事前に提示

### 🔨 2. コマンドビルダー
- **シナリオ選択式**
  - 「何をしたいか」を選ぶだけ
  - 必要な情報をフォームに入力
  - 自動的にコマンドを生成

- **対応シナリオ**
  - リポジトリ操作（init, clone, fork）
  - 変更の保存（add, commit, push）
  - ブランチ操作（作成、切り替え、削除、マージ）
  - 同期・更新（pull, fetch, fork同期）
  - GitHub操作（PR作成、Issue作成）

### 🧙 3. ステップバイステップ ウィザード
- **初めてのリポジトリ**: リポジトリ作成から最初のプッシュまで
- **ブランチワークフロー**: ブランチを使った開発の流れ
- **OSSコントリビュート**: Forkからプルリクエストまでの完全ガイド
- **コンフリクト解決**: マージコンフリクトの対処法

### 📚 4. コマンドリファレンス
- **全コマンド検索可能**
  - Git と GitHub CLI の主要コマンドを網羅
  - カテゴリ別に整理
  - 危険度ラベル付き
  - 使用例付き

### 🎨 5. その他の機能
- **ダークモード対応**: 目に優しいダークテーマ
- **レスポンシブデザイン**: スマホ・タブレットでも快適
- **オフライン対応**: 一度読み込めばオフラインでも使用可能
- **設定の永続化**: ローカルストレージで設定を保存

## 🚀 使い方

### セットアップ（超簡単！）

1. **リポジトリをクローン**
   ```bash
   git clone https://github.com/kuwa2005/git-cli-tutorial-tool.git
   cd git-cli-tutorial-tool
   ```

2. **ブラウザで開く**
   ```bash
   # そのまま index.html をブラウザで開くだけ！
   open index.html
   # または
   # Windowsの場合: start index.html
   # Linuxの場合: xdg-open index.html
   ```

3. **ローカルサーバーで開く（推奨）**
   ```bash
   # Python 3 がインストールされている場合
   python3 -m http.server 8000

   # その後ブラウザで http://localhost:8000 にアクセス
   ```

### 基本的な使い方

#### コマンド解析を使う

1. **「コマンド解析」タブを開く**
2. **実行したいコマンドを入力**
   ```
   例: git push upstream main
   ```
3. **「解析する」ボタンをクリック**
4. **結果を確認**
   - ⚠️ 警告があれば表示されます
   - 💡 コマンドの詳細な解説
   - ⚠️ 危険度評価
   - ✨ より良い代替案
   - ↩️ 元に戻す方法

#### コマンドビルダーを使う

1. **「コマンドビルダー」タブを開く**
2. **やりたいことを選択**
   ```
   例: 「変更をコミット」を選択
   ```
3. **必要な情報を入力**
   ```
   コミットメッセージ: "Add new feature"
   すべての変更を含める: チェック
   ```
4. **自動生成されたコマンドをコピー**
   ```
   git commit -am "Add new feature"
   ```

## 📖 実際の使用例

### 例1: Fork元への誤Pushを防ぐ

```bash
# このコマンドを入力
git push upstream main
```

**結果:**
```
🚨 Fork元へのプッシュ検出！

upstream は通常、フォーク元のリポジトリを指します。
フォーク元に直接プッシュすることは通常行いません。

推奨される方法:
1. 自分のフォーク（origin）にプッシュ
   git push origin main
2. Pull Request を作成
   gh pr create --repo upstream/repo
```

### 例2: 強制プッシュの危険性を理解

```bash
# このコマンドを入力
git push --force origin main
```

**結果:**
```
🚨 強制プッシュ（--force）を検出！

危険度: ⛔ 非常に危険

強制プッシュは、リモートの履歴を上書きします。
他の人が同じブランチで作業している場合、
その作業が失われる可能性があります。

より安全な代替案:
git push --force-with-lease origin main
```

### 例3: コマンドビルダーでPR作成

1. シナリオ選択: 「Pull Requestを作成」
2. 入力:
   - タイトル: "Add user authentication"
   - マージ先ブランチ: main
3. 生成されたコマンド:
   ```bash
   gh pr create --title "Add user authentication" --base main
   ```

## 🛠️ 技術スタック

- **HTML5**: セマンティックなマークアップ
- **CSS3**: モダンなスタイリング、CSS変数、ダークモード
- **Vanilla JavaScript**: フレームワーク不要、軽量
- **LocalStorage**: 設定の永続化

## 📁 プロジェクト構造

```
git-cli-tutorial-tool/
├── index.html              # メインHTML
├── css/
│   └── styles.css          # スタイルシート
├── js/
│   ├── command-database.js # コマンド情報データベース
│   ├── command-analyzer.js # コマンド解析エンジン
│   └── app.js              # メインアプリケーション
└── README.md               # このファイル
```

## 🎯 対応コマンド

### Git コマンド
- **情報確認**: status, log, diff, remote
- **ステージング**: add
- **コミット**: commit
- **リモート操作**: push, pull, fetch, clone
- **ブランチ操作**: branch, checkout, switch, merge
- **履歴操作**: reset, rebase
- **その他**: init, stash, clean

### GitHub CLI コマンド
- **Pull Request**: pr create, pr list, pr view, pr merge
- **Issue**: issue create, issue list, issue view
- **Repository**: repo create, repo fork, repo clone

## 🔒 セキュリティ機能

このツールは以下の危険な操作を検出して警告します：

- ✅ Fork元（upstream）への直接プッシュ
- ✅ 強制プッシュ（--force）
- ✅ main/masterブランチへの直接プッシュ
- ✅ 破壊的な操作（reset --hard, clean -f）
- ✅ 履歴改変（rebase, amend）

## 🌟 今後の予定

- [ ] ウィザード機能の完全実装
- [ ] PWA対応（完全オフライン動作）
- [ ] 多言語対応（英語）
- [ ] コマンド履歴機能
- [ ] お気に入りコマンド機能
- [ ] チートシートPDF出力
- [ ] AIアシスタント統合

## 🤝 コントリビュート

バグ報告、機能リクエスト、プルリクエストを歓迎します！

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. Pull Requestを作成

## 📝 ライセンス

MIT License

## 👨‍💻 作者

Created with ❤️ for Git & GitHub learners

---

**このツールで、Gitコマンドをもっと安全に、もっと楽しく！** 🚀
