/**
 * Git & GitHub Concepts
 * GitとGitHubの関係性、概念を解説するデータ
 */

const GitGitHubConcepts = {
    /**
     * GitとGitHubの基本概念
     */
    fundamentals: {
        title: 'Git と GitHub の違い',
        sections: [
            {
                id: 'what-is-git',
                title: '📦 Git とは？',
                icon: '💻',
                description: 'ローカルコンピュータで動作するバージョン管理システム',
                details: `
                    <div class="concept-box">
                        <h4>Git の役割</h4>
                        <ul>
                            <li><strong>ローカルでの作業:</strong> あなたのコンピュータ上でファイルの変更履歴を管理</li>
                            <li><strong>バージョン管理:</strong> いつ、誰が、何を変更したかを記録</li>
                            <li><strong>ブランチ機能:</strong> 複数の作業を並行して進められる</li>
                            <li><strong>オフライン動作:</strong> インターネット接続不要で作業可能</li>
                        </ul>

                        <h4>Git の3つのエリア</h4>
                        <div class="three-areas">
                            <div class="area">
                                <strong>1. Working Directory（作業ディレクトリ）</strong>
                                <p>実際にファイルを編集する場所</p>
                            </div>
                            <div class="area">
                                <strong>2. Staging Area（ステージングエリア）</strong>
                                <p>コミット前の準備場所（git add で追加）</p>
                            </div>
                            <div class="area">
                                <strong>3. Local Repository（ローカルリポジトリ）</strong>
                                <p>コミット履歴が保存される場所（.gitフォルダ）</p>
                            </div>
                        </div>

                        <div class="flow-visual">
                            <pre>
Working Directory  →  Staging Area  →  Local Repository
  (編集中)          git add         git commit
     📝        ───────────→  📦     ───────────→  💾
                            </pre>
                        </div>
                    </div>
                `,
                commands: [
                    { cmd: 'git init', desc: 'リポジトリを初期化（ローカル）' },
                    { cmd: 'git add <file>', desc: 'ファイルをステージング' },
                    { cmd: 'git commit -m "message"', desc: 'ローカルリポジトリに保存' },
                    { cmd: 'git status', desc: '現在の状態を確認' },
                    { cmd: 'git log', desc: 'コミット履歴を表示' }
                ]
            },
            {
                id: 'what-is-github',
                title: '☁️ GitHub とは？',
                icon: '🐙',
                description: 'クラウド上でGitリポジトリをホスティングするサービス',
                details: `
                    <div class="concept-box">
                        <h4>GitHub の役割</h4>
                        <ul>
                            <li><strong>リモートホスティング:</strong> クラウド上にリポジトリを保存</li>
                            <li><strong>コラボレーション:</strong> チームでコードを共有・レビュー</li>
                            <li><strong>バックアップ:</strong> コードを安全に保管</li>
                            <li><strong>公開・共有:</strong> オープンソースプロジェクトの公開</li>
                            <li><strong>プロジェクト管理:</strong> Issue, PR, Projects, Actionsなど</li>
                        </ul>

                        <h4>GitHub の主な機能</h4>
                        <div class="feature-grid">
                            <div class="feature">
                                <strong>📬 Pull Request (PR)</strong>
                                <p>コードレビューと変更提案</p>
                            </div>
                            <div class="feature">
                                <strong>🎫 Issues</strong>
                                <p>バグ報告・タスク管理</p>
                            </div>
                            <div class="feature">
                                <strong>🍴 Fork</strong>
                                <p>他人のリポジトリを自分のアカウントにコピー</p>
                            </div>
                            <div class="feature">
                                <strong>⚡ Actions</strong>
                                <p>CI/CD自動化</p>
                            </div>
                            <div class="feature">
                                <strong>📊 Projects</strong>
                                <p>カンバンボード</p>
                            </div>
                            <div class="feature">
                                <strong>🔒 Security</strong>
                                <p>脆弱性スキャン</p>
                            </div>
                        </div>

                        <div class="important-note">
                            <strong>💡 重要:</strong> GitはツールGitHubはサービスです。GitがなくてもGitHubは使えませんが、GitHubがなくてもGitは使えます。
                        </div>
                    </div>
                `,
                commands: [
                    { cmd: 'git remote add origin <url>', desc: 'GitHubリポジトリを登録' },
                    { cmd: 'git push origin main', desc: 'GitHubにアップロード' },
                    { cmd: 'git pull origin main', desc: 'GitHubから取得' },
                    { cmd: 'git clone <url>', desc: 'GitHubからコピー' }
                ]
            },
            {
                id: 'local-remote-flow',
                title: '🔄 ローカルとリモートの流れ',
                icon: '🔄',
                description: 'Git（ローカル）とGitHub（リモート）がどう連携するか',
                details: `
                    <div class="concept-box">
                        <h4>完全なワークフロー</h4>
                        <div class="full-workflow">
                            <pre>
┌─────────────────────────────────────────────────────────────┐
│                    🖥️  あなたのコンピュータ                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📝 Working Directory  →  📦 Staging  →  💾 Local Repo     │
│      (ファイル編集)      git add       git commit           │
│                                                             │
│                           │                                 │
│                           │ git push                        │
│                           ↓                                 │
└───────────────────────────┼─────────────────────────────────┘
                            │
                            │
┌───────────────────────────┼─────────────────────────────────┐
│                           ↓                                 │
│                    ☁️  GitHub (クラウド)                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              🌐 Remote Repository (origin)                  │
│                                                             │
│     ┌──────────────────────────────────────┐               │
│     │  • Pull Requests                     │               │
│     │  • Issues                            │               │
│     │  • Code Review                       │               │
│     │  • Collaboration                     │               │
│     └──────────────────────────────────────┘               │
│                           │                                 │
│                           │ git pull / git fetch            │
│                           ↓                                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
                    他の開発者も同じように
                            </pre>
                        </div>

                        <h4>実際の作業フロー例</h4>
                        <ol class="workflow-steps">
                            <li><strong>📝 編集:</strong> ローカルでファイルを編集</li>
                            <li><strong>📦 ステージング:</strong> <code>git add</code> で変更を準備</li>
                            <li><strong>💾 コミット:</strong> <code>git commit</code> でローカルに保存</li>
                            <li><strong>🔍 確認:</strong> <code>git status</code> で状態チェック</li>
                            <li><strong>⬆️ プッシュ:</strong> <code>git push</code> でGitHubにアップロード</li>
                            <li><strong>👥 共有:</strong> チームメンバーが <code>git pull</code> で取得</li>
                        </ol>

                        <div class="tip-highlight">
                            <strong>💡 ポイント:</strong>
                            <ul>
                                <li>ローカルでの作業は完全にあなただけのもの</li>
                                <li>pushするまで他の人には見えない</li>
                                <li>定期的にpushしてバックアップ</li>
                                <li>作業前にpullで最新を取得</li>
                            </ul>
                        </div>
                    </div>
                `
            }
        ]
    },

    /**
     * リモート管理の詳細
     */
    remoteManagement: {
        title: 'リモートリポジトリの管理',
        sections: [
            {
                id: 'origin-upstream',
                title: 'origin と upstream の違い',
                description: 'リモート名の使い分けを理解する',
                diagram: `
                    <div class="remote-diagram">
                        <pre>
┌────────────────────────────────────────────────────┐
│         🏢 元のリポジトリ (upstream)                │
│         例: facebook/react                         │
│         https://github.com/facebook/react          │
└─────────────────┬──────────────────────────────────┘
                  │
                  │ Fork (複製)
                  ↓
┌─────────────────────────────────────────────────────┐
│         👤 あなたのFork (origin)                    │
│         例: yourname/react                          │
│         https://github.com/yourname/react           │
└─────────────────┬───────────────────────────────────┘
                  │
                  │ Clone (ダウンロード)
                  ↓
┌─────────────────────────────────────────────────────┐
│         💻 ローカルリポジトリ                        │
│         あなたのコンピュータ                         │
└─────────────────────────────────────────────────────┘

作業の流れ:
1. upstream から最新を取得: git fetch upstream
2. ローカルで作業: git commit
3. origin にプッシュ: git push origin feature-branch
4. Pull Request作成: upstream に変更を提案
                        </pre>
                    </div>
                `,
                details: `
                    <h4>origin（オリジン）</h4>
                    <div class="remote-box origin">
                        <p><strong>意味:</strong> 「あなたの」GitHubリポジトリ</p>
                        <p><strong>用途:</strong> 自分の変更をpushする場所</p>
                        <p><strong>権限:</strong> 読み書き両方OK</p>
                        <p><strong>設定:</strong> git cloneすると自動的に設定される</p>
                        <div class="example-commands">
                            <code>git push origin main</code> ← よく使う ✅<br>
                            <code>git pull origin main</code> ← よく使う ✅
                        </div>
                    </div>

                    <h4>upstream（アップストリーム）</h4>
                    <div class="remote-box upstream">
                        <p><strong>意味:</strong> 「元の」GitHubリポジトリ（Fork元）</p>
                        <p><strong>用途:</strong> 最新の変更を取得する場所</p>
                        <p><strong>権限:</strong> 読み取りのみ（通常）</p>
                        <p><strong>設定:</strong> 手動で追加する必要がある</p>
                        <div class="example-commands">
                            <code>git fetch upstream</code> ← 取得のみ ✅<br>
                            <code>git push upstream main</code> ← 絶対ダメ ❌
                        </div>
                    </div>

                    <div class="danger-warning">
                        <strong>⚠️ 重要な注意:</strong>
                        <p><code>git push upstream</code> は基本的に使いません！</p>
                        <p>upstreamへの変更はPull Requestで行います。</p>
                    </div>
                `,
                commands: [
                    {
                        cmd: 'git remote -v',
                        desc: 'リモート一覧を確認',
                        example: `
origin  https://github.com/yourname/repo.git (fetch)
origin  https://github.com/yourname/repo.git (push)
upstream  https://github.com/original/repo.git (fetch)
upstream  https://github.com/original/repo.git (push)
                        `
                    },
                    {
                        cmd: 'git remote add upstream <url>',
                        desc: 'upstreamを追加',
                        example: 'git remote add upstream https://github.com/facebook/react.git'
                    },
                    {
                        cmd: 'git fetch upstream',
                        desc: 'upstreamの最新を取得'
                    },
                    {
                        cmd: 'git merge upstream/main',
                        desc: 'upstreamの変更を取り込む'
                    }
                ]
            },
            {
                id: 'fork-workflow',
                title: 'Forkワークフローの完全ガイド',
                description: 'OSSにコントリビュートする標準的な流れ',
                details: `
                    <div class="workflow-complete">
                        <h4>📋 完全な手順</h4>

                        <div class="step-detail">
                            <h5>ステップ1: Fork & Clone</h5>
                            <div class="commands">
                                <code># GitHub上でForkボタンをクリック</code><br>
                                <code>gh repo fork owner/repo --clone</code><br>
                                <code># または</code><br>
                                <code>git clone https://github.com/yourname/repo.git</code>
                            </div>
                        </div>

                        <div class="step-detail">
                            <h5>ステップ2: Upstreamを追加</h5>
                            <div class="commands">
                                <code>cd repo</code><br>
                                <code>git remote add upstream https://github.com/owner/repo.git</code><br>
                                <code>git remote -v  # 確認</code>
                            </div>
                        </div>

                        <div class="step-detail">
                            <h5>ステップ3: 最新に同期</h5>
                            <div class="commands">
                                <code>git fetch upstream</code><br>
                                <code>git checkout main</code><br>
                                <code>git merge upstream/main</code>
                            </div>
                            <p class="note">💡 作業前に必ず実行！</p>
                        </div>

                        <div class="step-detail">
                            <h5>ステップ4: ブランチ作成</h5>
                            <div class="commands">
                                <code>git checkout -b feature/my-contribution</code>
                            </div>
                        </div>

                        <div class="step-detail">
                            <h5>ステップ5: 作業 & コミット</h5>
                            <div class="commands">
                                <code># ファイルを編集...</code><br>
                                <code>git add .</code><br>
                                <code>git commit -m "Add: 新機能の説明"</code>
                            </div>
                        </div>

                        <div class="step-detail">
                            <h5>ステップ6: 自分のForkにPush</h5>
                            <div class="commands">
                                <code>git push origin feature/my-contribution</code>
                            </div>
                            <div class="warning-inline">
                                ❌ <code>git push upstream</code> ではありません！
                            </div>
                        </div>

                        <div class="step-detail">
                            <h5>ステップ7: Pull Request作成</h5>
                            <div class="commands">
                                <code>gh pr create --repo owner/repo --base main</code><br>
                                <code># またはGitHubのWebUIで作成</code>
                            </div>
                        </div>

                        <div class="step-detail">
                            <h5>ステップ8: レビュー対応</h5>
                            <div class="commands">
                                <code># 修正を加えて...</code><br>
                                <code>git add .</code><br>
                                <code>git commit -m "Fix: レビュー指摘対応"</code><br>
                                <code>git push origin feature/my-contribution</code>
                            </div>
                            <p class="note">💡 同じブランチにpushすればPRに自動反映！</p>
                        </div>
                    </div>
                `
            }
        ]
    },

    /**
     * GitHub CLI の完全ガイド
     */
    githubCLI: {
        title: 'GitHub CLI (gh) 完全ガイド',
        description: 'コマンドラインからGitHub操作を行う公式ツール',
        sections: [
            {
                id: 'gh-overview',
                title: 'GitHub CLI とは',
                content: `
                    <div class="gh-intro">
                        <h4>🐙 GitHub CLI (gh) の特徴</h4>
                        <ul>
                            <li>GitHubの公式コマンドラインツール</li>
                            <li>ブラウザを開かずにPR, Issue, Repoなどを操作</li>
                            <li>認証も簡単（gh auth login）</li>
                            <li>スクリプトやCIに組み込める</li>
                        </ul>

                        <div class="comparison">
                            <h5>git と gh の違い</h5>
                            <table class="comparison-table">
                                <tr>
                                    <th>操作</th>
                                    <th>git コマンド</th>
                                    <th>gh コマンド</th>
                                </tr>
                                <tr>
                                    <td>リポジトリ作成</td>
                                    <td>git init（ローカルのみ）</td>
                                    <td>gh repo create（GitHub上に作成）</td>
                                </tr>
                                <tr>
                                    <td>クローン</td>
                                    <td>git clone &lt;url&gt;</td>
                                    <td>gh repo clone owner/repo</td>
                                </tr>
                                <tr>
                                    <td>PR作成</td>
                                    <td>❌ できない</td>
                                    <td>✅ gh pr create</td>
                                </tr>
                                <tr>
                                    <td>Issue作成</td>
                                    <td>❌ できない</td>
                                    <td>✅ gh issue create</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                `
            },
            {
                id: 'gh-commands',
                title: 'よく使うghコマンド',
                commands: [
                    {
                        category: '認証',
                        items: [
                            { cmd: 'gh auth login', desc: 'GitHubにログイン' },
                            { cmd: 'gh auth status', desc: 'ログイン状態確認' },
                            { cmd: 'gh auth logout', desc: 'ログアウト' }
                        ]
                    },
                    {
                        category: 'リポジトリ操作',
                        items: [
                            { cmd: 'gh repo create', desc: '新しいリポジトリ作成' },
                            { cmd: 'gh repo clone owner/repo', desc: 'リポジトリをクローン' },
                            { cmd: 'gh repo fork owner/repo', desc: 'リポジトリをフォーク' },
                            { cmd: 'gh repo view', desc: 'リポジトリ情報を表示' },
                            { cmd: 'gh repo view --web', desc: 'ブラウザで開く' }
                        ]
                    },
                    {
                        category: 'Pull Request',
                        items: [
                            { cmd: 'gh pr create', desc: 'PRを作成' },
                            { cmd: 'gh pr list', desc: 'PR一覧を表示' },
                            { cmd: 'gh pr view 123', desc: 'PR詳細を表示' },
                            { cmd: 'gh pr checkout 123', desc: 'PRをチェックアウト' },
                            { cmd: 'gh pr review', desc: 'PRをレビュー' },
                            { cmd: 'gh pr merge', desc: 'PRをマージ' },
                            { cmd: 'gh pr close', desc: 'PRをクローズ' }
                        ]
                    },
                    {
                        category: 'Issue',
                        items: [
                            { cmd: 'gh issue create', desc: 'Issueを作成' },
                            { cmd: 'gh issue list', desc: 'Issue一覧' },
                            { cmd: 'gh issue view 456', desc: 'Issue詳細' },
                            { cmd: 'gh issue close 456', desc: 'Issueをクローズ' }
                        ]
                    },
                    {
                        category: 'GitHub Actions',
                        items: [
                            { cmd: 'gh workflow list', desc: 'ワークフロー一覧' },
                            { cmd: 'gh run list', desc: '実行履歴' },
                            { cmd: 'gh run view', desc: '実行詳細' },
                            { cmd: 'gh run watch', desc: '実行をウォッチ' }
                        ]
                    }
                ]
            },
            {
                id: 'gh-pr-workflow',
                title: 'ghコマンドでのPRワークフロー',
                content: `
                    <div class="gh-workflow">
                        <h4>🚀 GitHub CLIを使った効率的なPRフロー</h4>

                        <div class="workflow-box">
                            <h5>1️⃣ ブランチ作成 & 作業</h5>
                            <code>git checkout -b feature/new-feature</code><br>
                            <code># ファイル編集...</code><br>
                            <code>git add .</code><br>
                            <code>git commit -m "Add new feature"</code>
                        </div>

                        <div class="workflow-box">
                            <h5>2️⃣ プッシュ & PR作成（一気に！）</h5>
                            <code>git push origin feature/new-feature</code><br>
                            <code>gh pr create --title "Add new feature" --body "説明..."</code>
                            <p class="tip">💡 --web フラグでブラウザで編集も可能</p>
                        </div>

                        <div class="workflow-box">
                            <h5>3️⃣ PR確認</h5>
                            <code>gh pr list  # 自分のPR一覧</code><br>
                            <code>gh pr view  # 現在のブランチのPR詳細</code><br>
                            <code>gh pr checks  # CI/CDの状況確認</code>
                        </div>

                        <div class="workflow-box">
                            <h5>4️⃣ レビュー対応</h5>
                            <code># 修正...</code><br>
                            <code>git add .</code><br>
                            <code>git commit -m "Address review comments"</code><br>
                            <code>git push  # 自動的にPRに反映</code>
                        </div>

                        <div class="workflow-box">
                            <h5>5️⃣ マージ</h5>
                            <code>gh pr merge --squash  # Squash merge</code><br>
                            <code>gh pr merge --merge  # Merge commit</code><br>
                            <code>gh pr merge --rebase  # Rebase merge</code>
                        </div>
                    </div>
                `
            }
        ]
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GitGitHubConcepts;
}
