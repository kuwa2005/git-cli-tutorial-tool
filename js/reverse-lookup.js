/**
 * Reverse Lookup Database
 * 「やりたいこと」から「必要なコマンド」を検索するデータベース
 */

const ReverseLookupDatabase = {
    categories: {
        'undo': { name: '取り消し・やり直し', icon: '↩️' },
        'fix': { name: '修正・変更', icon: '🔧' },
        'info': { name: '情報確認', icon: '🔍' },
        'cleanup': { name: '整理・削除', icon: '🧹' },
        'sync': { name: '同期・更新', icon: '🔄' },
        'branch': { name: 'ブランチ操作', icon: '🌿' },
        'remote': { name: 'リモート操作', icon: '📡' },
        'github': { name: 'GitHub操作', icon: '🐙' },
        'safety': { name: '安全な操作', icon: '✅' }
    },

    tasks: [
        // 取り消し・やり直し
        {
            id: 'undo-last-commit',
            category: 'undo',
            task: '最後のコミットを取り消したい',
            keywords: ['コミット', '取り消し', '戻す', 'アンドゥ'],
            solutions: [
                {
                    title: '変更を残してコミットだけ取り消す（推奨）',
                    commands: [
                        { cmd: 'git reset --soft HEAD~1', desc: '【状況】コミットメッセージを間違えた、またはコミットするのが早すぎた場合\n【実行すると】Gitの履歴から最後のコミット記録が削除されます。ただし、ファイルの変更内容はそのまま残り、「git add」した状態（ステージング済み）で保持されます\n【結果】ファイルは編集済みのまま、すぐに再コミットできる状態に戻ります。コミットメッセージを書き直したり、追加でファイルを修正してから改めてコミットできます' }
                    ],
                    when: 'まだプッシュしていない場合',
                    dangerLevel: 'safe'
                },
                {
                    title: '変更もすべて取り消す',
                    commands: [
                        { cmd: 'git reset --hard HEAD~1', desc: '【状況】最後のコミット自体が不要で、変更内容も全部捨てたい場合\n【実行すると】Gitの履歴から最後のコミットが削除され、同時にファイルの変更内容も完全に削除されます。ファイルは1つ前のコミット時点の状態に完全に戻ります\n【結果】最後のコミットで変更した内容はすべて消えます。元に戻す方法はありません\n【例】間違って不要なファイルをコミットしてしまい、そのファイル自体が不要な場合' }
                    ],
                    when: '変更が不要な場合',
                    dangerLevel: 'high',
                    warning: '⚠️ 変更内容は完全に失われます'
                }
            ]
        },
        {
            id: 'undo-pushed-commit',
            category: 'undo',
            task: 'プッシュ済みのコミットを取り消したい',
            keywords: ['プッシュ', '取り消し', 'リモート', '公開'],
            solutions: [
                {
                    title: '新しいコミットで打ち消す（推奨）',
                    commands: [
                        { cmd: 'git revert HEAD', desc: '【状況】既にGitHubにプッシュしたコミットに問題があった場合\n【実行すると】問題のあるコミットはそのまま履歴に残しつつ、その変更内容を「逆向き」に打ち消す新しいコミットを自動作成します\n【結果】ファイルは問題のコミット前の状態に戻りますが、履歴には「コミットA→それを打ち消すコミットB」という記録が残ります。他のメンバーの作業に影響を与えません\n【例】バグのあるコードをコミット→revertで修正前に戻す→修正版を新たにコミット' },
                        { cmd: 'git push origin main', desc: '【実行すると】打ち消しコミットをGitHubに送信します\n【結果】チーム全員が安全に最新の状態を取得できます' }
                    ],
                    when: '履歴を保持したい場合（チーム開発では必須）',
                    dangerLevel: 'safe'
                },
                {
                    title: '強制的に履歴を書き換える',
                    commands: [
                        { cmd: 'git reset --hard HEAD~1', desc: '【状況】完全に個人のリポジトリで、誰も影響を受けない場合のみ\n【実行すると】ローカルの履歴から問題のコミットを完全に削除します' },
                        { cmd: 'git push --force origin main', desc: '【実行すると】GitHub上の履歴も強制的に書き換えます\n【結果】問題のコミットは履歴から消えます。しかし他の人が既にそのコミットを取得していた場合、その人のリポジトリと矛盾が生じて深刻な問題になります\n【危険性】チームメンバーの作業が壊れる可能性があります' }
                    ],
                    when: '個人リポジトリで他に影響がない場合のみ',
                    dangerLevel: 'critical',
                    warning: '🚨 チーム開発では絶対に使わないでください'
                }
            ]
        },
        {
            id: 'undo-staging',
            category: 'undo',
            task: 'ステージングしたファイルを取り消したい',
            keywords: ['ステージング', 'add', '取り消し'],
            solutions: [
                {
                    title: 'ステージングを解除',
                    commands: [
                        { cmd: 'git restore --staged <file>', desc: '【状況】「git add」でファイルをステージングしたけど、やっぱりコミットしたくない場合\n【実行すると】指定したファイルをステージングエリアから外します。ファイル自体の変更内容はそのまま残ります\n【結果】ファイルは「変更済みだけどステージングされていない」状態に戻ります。git statusで見ると赤色で表示されます\n【例】app.jsとtest.jsを間違えて両方addしたが、app.jsだけコミットしたい→test.jsをrestoreで外す' },
                        { cmd: 'git restore --staged .', desc: '【実行すると】すべてのステージング済みファイルをまとめてステージングエリアから外します\n【結果】すべてのファイルが「変更はあるがステージングされていない」状態に戻ります。ファイルの編集内容は保持されます' }
                    ],
                    when: 'ファイルは変更したまま、ステージングだけ解除したい',
                    dangerLevel: 'safe'
                }
            ]
        },

        // 修正・変更
        {
            id: 'fix-commit-message',
            category: 'fix',
            task: 'コミットメッセージを修正したい',
            keywords: ['コミットメッセージ', '修正', '変更', 'amend'],
            solutions: [
                {
                    title: '最後のコミットメッセージを修正（未プッシュ）',
                    commands: [
                        { cmd: 'git commit --amend -m "新しいメッセージ"', desc: '【状況】コミットメッセージにtypoがあった、説明が不十分だった場合\n【実行すると】最後のコミットのメッセージだけを新しいものに書き換えます。ファイルの変更内容やコミット時刻は変わりません\n【結果】git logで見たとき、最後のコミットメッセージが新しい内容に変わっています。まだプッシュしていないので、GitHub上には何も影響ありません\n【例】「Fix bug」→「Fix login validation bug (#123)」のように詳しく書き直す' }
                    ],
                    when: 'まだプッシュしていない場合',
                    dangerLevel: 'safe'
                },
                {
                    title: 'プッシュ済みのメッセージを修正',
                    commands: [
                        { cmd: 'git commit --amend -m "新しいメッセージ"', desc: '【実行すると】ローカルで最後のコミットメッセージを書き換えます' },
                        { cmd: 'git push --force-with-lease origin main', desc: '【実行すると】書き換えたコミットをGitHubに強制的に送ります。--force-with-leaseは、他の人が先にプッシュしていた場合は失敗するので、完全な--forceより安全です\n【結果】GitHub上のコミットメッセージも書き換わります\n【注意】他の人がこのブランチで作業している場合、その人の履歴と食い違いが生じます' }
                    ],
                    when: '個人ブランチの場合のみ',
                    dangerLevel: 'warning',
                    warning: '⚠️ 共有ブランチでは使用を避けてください'
                }
            ]
        },
        {
            id: 'add-to-last-commit',
            category: 'fix',
            task: '最後のコミットに追加のファイルを含めたい',
            keywords: ['コミット', '追加', 'ファイル', '忘れた'],
            solutions: [
                {
                    title: 'ファイルを追加してコミットを修正',
                    commands: [
                        { cmd: 'git add forgotten-file.txt', desc: '【状況】コミットした後に「しまった、このファイルも一緒にコミットするべきだった」と気づいた場合\n【実行すると】忘れていたファイルをステージングエリアに追加します' },
                        { cmd: 'git commit --amend --no-edit', desc: '【実行すると】ステージングエリアにある内容（先ほど追加したファイル）を最後のコミットに統合します。--no-editオプションで、コミットメッセージはそのまま保持します\n【結果】最後のコミットに忘れていたファイルが含まれます。git logで見ると、まるで最初から一緒にコミットしていたように見えます\n【例】README.mdとindex.htmlを一緒にコミットしたかったのに、README.mdを忘れた→後からaddしてamendで統合' }
                    ],
                    when: 'まだプッシュしていない場合',
                    dangerLevel: 'safe'
                }
            ]
        },

        // 情報確認
        {
            id: 'check-status',
            category: 'info',
            task: '現在の変更状況を確認したい',
            keywords: ['状態', '確認', 'ステータス', '変更'],
            solutions: [
                {
                    title: '基本的な状態確認',
                    commands: [
                        { cmd: 'git status', desc: '変更されたファイルとステージング状態を表示' },
                        { cmd: 'git status -s', desc: '簡潔な表示形式' }
                    ],
                    dangerLevel: 'safe'
                }
            ]
        },
        {
            id: 'check-diff',
            category: 'info',
            task: '何が変更されたか詳しく見たい',
            keywords: ['差分', '変更内容', 'diff'],
            solutions: [
                {
                    title: '変更内容を確認',
                    commands: [
                        { cmd: 'git diff', desc: 'ワーキングディレクトリの変更を表示' },
                        { cmd: 'git diff --staged', desc: 'ステージングされた変更を表示' },
                        { cmd: 'git diff HEAD', desc: '最後のコミットからのすべての変更' }
                    ],
                    dangerLevel: 'safe'
                }
            ]
        },
        {
            id: 'check-commit-history',
            category: 'info',
            task: 'コミット履歴を確認したい',
            keywords: ['履歴', 'ログ', 'history', 'log'],
            solutions: [
                {
                    title: 'コミット履歴の表示',
                    commands: [
                        { cmd: 'git log --oneline', desc: '1行形式で表示' },
                        { cmd: 'git log --oneline --graph --all', desc: 'グラフ付きですべてのブランチを表示' },
                        { cmd: 'git log -p', desc: '変更内容も含めて表示' }
                    ],
                    dangerLevel: 'safe'
                }
            ]
        },
        {
            id: 'check-remote',
            category: 'info',
            task: 'リモートリポジトリの設定を確認したい',
            keywords: ['リモート', 'origin', 'upstream', '確認'],
            solutions: [
                {
                    title: 'リモート設定の確認',
                    commands: [
                        { cmd: 'git remote -v', desc: '登録されているリモートURLを表示' },
                        { cmd: 'git remote show origin', desc: 'originの詳細情報を表示' }
                    ],
                    dangerLevel: 'safe'
                }
            ]
        },

        // 整理・削除
        {
            id: 'delete-local-branch',
            category: 'cleanup',
            task: 'ローカルブランチを削除したい',
            keywords: ['ブランチ', '削除', 'ローカル'],
            solutions: [
                {
                    title: 'マージ済みブランチを削除',
                    commands: [
                        { cmd: 'git branch -d feature-branch', desc: 'マージ済みブランチのみ削除可能' }
                    ],
                    when: 'ブランチがすでにマージ済みの場合',
                    dangerLevel: 'safe'
                },
                {
                    title: '強制的に削除',
                    commands: [
                        { cmd: 'git branch -D feature-branch', desc: 'マージされていなくても削除' }
                    ],
                    when: 'ブランチの変更が不要な場合',
                    dangerLevel: 'warning',
                    warning: '⚠️ 未マージの変更は失われます'
                }
            ]
        },
        {
            id: 'delete-remote-branch',
            category: 'cleanup',
            task: 'リモートブランチを削除したい',
            keywords: ['ブランチ', '削除', 'リモート', 'GitHub'],
            solutions: [
                {
                    title: 'リモートブランチの削除',
                    commands: [
                        { cmd: 'git push origin --delete feature-branch', desc: 'リモートブランチを削除' }
                    ],
                    dangerLevel: 'warning',
                    warning: '⚠️ チームメンバーも影響を受けます'
                }
            ]
        },
        {
            id: 'clean-untracked',
            category: 'cleanup',
            task: '追跡されていないファイルを削除したい',
            keywords: ['削除', 'untracked', '未追跡', 'クリーン'],
            solutions: [
                {
                    title: '削除予定のファイルを確認（安全）',
                    commands: [
                        { cmd: 'git clean -n', desc: '削除されるファイルをプレビュー' }
                    ],
                    dangerLevel: 'safe'
                },
                {
                    title: '実際に削除',
                    commands: [
                        { cmd: 'git clean -f', desc: '未追跡ファイルを削除' },
                        { cmd: 'git clean -fd', desc: '未追跡ファイルとディレクトリを削除' }
                    ],
                    dangerLevel: 'high',
                    warning: '⚠️ 削除したファイルは復元できません'
                }
            ]
        },

        // 同期・更新
        {
            id: 'sync-fork',
            category: 'sync',
            task: 'フォークを最新状態に同期したい',
            keywords: ['フォーク', '同期', 'upstream', '最新'],
            solutions: [
                {
                    title: 'GitHub CLI で同期（最も簡単）',
                    commands: [
                        { cmd: 'gh repo sync', desc: 'フォークを自動的に同期' }
                    ],
                    when: 'GitHub CLI がインストール済みの場合',
                    dangerLevel: 'safe'
                },
                {
                    title: 'Git コマンドで同期',
                    commands: [
                        { cmd: 'git fetch upstream', desc: 'upstreamから最新の変更を取得' },
                        { cmd: 'git checkout main', desc: 'mainブランチに切り替え' },
                        { cmd: 'git merge upstream/main', desc: 'upstreamの変更をマージ' },
                        { cmd: 'git push origin main', desc: '自分のフォークを更新' }
                    ],
                    when: 'upstreamリモートが設定済みの場合',
                    dangerLevel: 'safe'
                }
            ]
        },
        {
            id: 'pull-latest',
            category: 'sync',
            task: 'リモートの最新状態を取得したい',
            keywords: ['pull', '取得', '最新', '更新'],
            solutions: [
                {
                    title: '最新の変更を取得してマージ',
                    commands: [
                        { cmd: 'git pull origin main', desc: 'リモートから最新の変更を取得してマージ' }
                    ],
                    dangerLevel: 'safe'
                },
                {
                    title: '取得のみ（マージしない）',
                    commands: [
                        { cmd: 'git fetch origin', desc: '変更を取得するがマージはしない' },
                        { cmd: 'git log origin/main', desc: '取得した変更を確認' }
                    ],
                    when: 'まず内容を確認してからマージしたい場合',
                    dangerLevel: 'safe'
                }
            ]
        },

        // ブランチ操作
        {
            id: 'create-branch',
            category: 'branch',
            task: '新しいブランチを作成したい',
            keywords: ['ブランチ', '作成', '新規'],
            solutions: [
                {
                    title: 'ブランチを作成して切り替え',
                    commands: [
                        { cmd: 'git checkout -b feature-branch', desc: '新しいブランチを作成して切り替え' },
                        { cmd: 'git switch -c feature-branch', desc: '新しい書き方（Git 2.23+）' }
                    ],
                    dangerLevel: 'safe'
                }
            ]
        },
        {
            id: 'switch-branch',
            category: 'branch',
            task: 'ブランチを切り替えたい',
            keywords: ['ブランチ', '切り替え', 'checkout', 'switch'],
            solutions: [
                {
                    title: 'ブランチの切り替え',
                    commands: [
                        { cmd: 'git checkout main', desc: 'mainブランチに切り替え' },
                        { cmd: 'git switch main', desc: '新しい書き方（Git 2.23+）' }
                    ],
                    dangerLevel: 'safe'
                }
            ]
        },
        {
            id: 'list-branches',
            category: 'branch',
            task: 'ブランチ一覧を見たい',
            keywords: ['ブランチ', '一覧', 'リスト'],
            solutions: [
                {
                    title: 'ブランチの一覧表示',
                    commands: [
                        { cmd: 'git branch', desc: 'ローカルブランチを表示' },
                        { cmd: 'git branch -r', desc: 'リモートブランチを表示' },
                        { cmd: 'git branch -a', desc: 'すべてのブランチを表示' }
                    ],
                    dangerLevel: 'safe'
                }
            ]
        },

        // リモート操作
        {
            id: 'add-remote',
            category: 'remote',
            task: 'リモートリポジトリを追加したい',
            keywords: ['リモート', '追加', 'origin', 'upstream'],
            solutions: [
                {
                    title: 'リモートの追加',
                    commands: [
                        { cmd: 'git remote add origin https://github.com/user/repo.git', desc: 'originリモートを追加' },
                        { cmd: 'git remote add upstream https://github.com/original/repo.git', desc: 'upstreamリモートを追加（フォークの場合）' }
                    ],
                    dangerLevel: 'safe'
                }
            ]
        },
        {
            id: 'change-remote-url',
            category: 'remote',
            task: 'リモートURLを変更したい',
            keywords: ['リモート', 'URL', '変更', '修正'],
            solutions: [
                {
                    title: 'リモートURLの変更',
                    commands: [
                        { cmd: 'git remote set-url origin https://github.com/user/new-repo.git', desc: 'originのURLを変更' }
                    ],
                    dangerLevel: 'safe'
                }
            ]
        },

        // GitHub操作
        {
            id: 'create-pr',
            category: 'github',
            task: 'プルリクエストを作成したい',
            keywords: ['PR', 'プルリクエスト', '作成'],
            solutions: [
                {
                    title: 'GitHub CLI でPR作成（推奨）',
                    commands: [
                        { cmd: 'gh pr create --title "タイトル" --body "説明"', desc: 'PRを作成' },
                        { cmd: 'gh pr create --web', desc: 'ブラウザでPR作成画面を開く' }
                    ],
                    dangerLevel: 'safe'
                }
            ]
        },
        {
            id: 'view-pr-list',
            category: 'github',
            task: 'プルリクエスト一覧を見たい',
            keywords: ['PR', 'プルリクエスト', '一覧'],
            solutions: [
                {
                    title: 'PR一覧の表示',
                    commands: [
                        { cmd: 'gh pr list', desc: 'オープン中のPR一覧を表示' },
                        { cmd: 'gh pr list --state all', desc: 'すべてのPRを表示' }
                    ],
                    dangerLevel: 'safe'
                }
            ]
        },

        // 安全な操作
        {
            id: 'stash-changes',
            category: 'safety',
            task: '変更を一時的に退避したい',
            keywords: ['stash', '退避', '一時保存'],
            solutions: [
                {
                    title: '変更の一時退避',
                    commands: [
                        { cmd: 'git stash', desc: '現在の変更を退避' },
                        { cmd: 'git stash save "作業内容の説明"', desc: '説明付きで退避' }
                    ],
                    when: 'ブランチを切り替える前に変更を保存したい',
                    dangerLevel: 'safe'
                },
                {
                    title: '退避した変更を戻す',
                    commands: [
                        { cmd: 'git stash list', desc: '退避リストを表示' },
                        { cmd: 'git stash pop', desc: '最新の退避を適用して削除' },
                        { cmd: 'git stash apply', desc: '退避を適用（削除しない）' }
                    ],
                    dangerLevel: 'safe'
                }
            ]
        },
        {
            id: 'backup-before-operation',
            category: 'safety',
            task: '危険な操作の前にバックアップしたい',
            keywords: ['バックアップ', '安全', 'ブランチ'],
            solutions: [
                {
                    title: '現在の状態をバックアップ',
                    commands: [
                        { cmd: 'git branch backup-$(date +%Y%m%d)', desc: '日付付きバックアップブランチを作成' },
                        { cmd: 'git tag backup-point', desc: 'タグでマーク' }
                    ],
                    dangerLevel: 'safe'
                }
            ]
        },

        // GitHub連携
        {
            id: 'clone-github-repo',
            category: 'github',
            task: 'GitHubのリポジトリをローカルにクローンしたい',
            keywords: ['クローン', 'GitHub', 'ダウンロード', 'ローカル'],
            solutions: [
                {
                    title: 'HTTPSでクローン（推奨）',
                    commands: [
                        { cmd: 'git clone https://github.com/owner/repo.git', desc: 'HTTPSプロトコルでクローン' },
                        { cmd: 'git clone https://github.com/owner/repo.git my-folder', desc: 'ディレクトリ名を指定してクローン' }
                    ],
                    when: '通常のクローン（認証はGitHub CLIまたはトークンで）',
                    dangerLevel: 'safe'
                },
                {
                    title: 'SSHでクローン',
                    commands: [
                        { cmd: 'git clone git@github.com:owner/repo.git', desc: 'SSHキーを使ってクローン' }
                    ],
                    when: 'SSHキーを設定済みの場合',
                    dangerLevel: 'safe'
                }
            ]
        },
        {
            id: 'push-local-changes',
            category: 'github',
            task: 'ローカルで変更したファイルをGitHubにプッシュしたい（2回目以降）',
            keywords: ['プッシュ', 'ローカル', '変更', 'アップロード', '2回目'],
            solutions: [
                {
                    title: '標準的なワークフロー（推奨）',
                    commands: [
                        { cmd: 'git status', desc: '【実行すると】どのファイルが変更されているか、ステージングされているか確認できます\n【確認内容】赤字＝変更あるがステージングされていない、緑字＝ステージング済み' },
                        { cmd: 'git pull origin main', desc: '【なぜ必要？】他の場所（例：Claude Code）で変更してプッシュした内容を取得します。これをしないと、古い状態に上書きしてしまう危険があります\n【実行すると】GitHubの最新の状態とローカルを同期します' },
                        { cmd: 'git add .', desc: '【実行すると】現在のディレクトリのすべての変更ファイルをステージングエリアに追加します（コミット対象として登録）\n【結果】git statusで見ると、ファイルが緑色で表示されます' },
                        { cmd: 'git commit -m "変更内容の説明"', desc: '【実行すると】ステージングした変更を1つのコミット（記録ポイント）として保存します\n【例】"Add user authentication feature" "Fix bug in login form"など具体的に書く' },
                        { cmd: 'git push origin main', desc: '【実行すると】ローカルで作成したコミットをGitHubに送信します\n【結果】GitHub上のリポジトリが更新され、他の環境からも変更が見えるようになります' }
                    ],
                    when: 'Claude Codeで編集→ローカルPCで実行確認→変更をプッシュする場合',
                    dangerLevel: 'safe'
                },
                {
                    title: '一連の操作をまとめて実行',
                    commands: [
                        { cmd: 'git add . && git commit -m "Update files" && git push origin main', desc: 'ステージング→コミット→プッシュを一度に実行' }
                    ],
                    when: '変更内容を確認済みで、素早くプッシュしたい場合',
                    dangerLevel: 'safe',
                    warning: '⚠️ 実行前に git status で変更内容を確認することを推奨'
                }
            ]
        },
        {
            id: 'check-before-push',
            category: 'github',
            task: 'プッシュする前に変更内容を確認したい',
            keywords: ['確認', 'プッシュ', '変更', 'レビュー'],
            solutions: [
                {
                    title: '変更内容の確認手順',
                    commands: [
                        { cmd: 'git status', desc: '変更されたファイル一覧を表示' },
                        { cmd: 'git diff', desc: 'まだステージングされていない変更を表示' },
                        { cmd: 'git diff --staged', desc: 'ステージング済みの変更を表示' },
                        { cmd: 'git log --oneline -5', desc: '最近のコミット5件を表示' }
                    ],
                    dangerLevel: 'safe'
                }
            ]
        },
        {
            id: 'first-time-setup-after-clone',
            category: 'github',
            task: 'クローン後、初めて変更をプッシュする準備をしたい',
            keywords: ['クローン後', '初回', 'セットアップ', '設定'],
            solutions: [
                {
                    title: '初回セットアップ手順',
                    commands: [
                        { cmd: 'git config user.name "Your Name"', desc: 'ユーザー名を設定' },
                        { cmd: 'git config user.email "your.email@example.com"', desc: 'メールアドレスを設定' },
                        { cmd: 'git remote -v', desc: 'リモートリポジトリの設定を確認' }
                    ],
                    when: 'クローン後、初めての変更をプッシュする前',
                    dangerLevel: 'safe'
                }
            ]
        },
        {
            id: 'common-push-issues',
            category: 'github',
            task: 'プッシュがrejectedされた（拒否された）',
            keywords: ['rejected', 'エラー', 'プッシュ失敗', '拒否'],
            solutions: [
                {
                    title: '最新の変更を取得してからプッシュ',
                    commands: [
                        { cmd: 'git pull origin main', desc: 'リモートの最新の変更を取得' },
                        { cmd: 'git push origin main', desc: '再度プッシュ' }
                    ],
                    when: '他の人がプッシュした後で、ローカルが古い場合',
                    dangerLevel: 'safe'
                },
                {
                    title: 'リベースしてからプッシュ',
                    commands: [
                        { cmd: 'git pull --rebase origin main', desc: 'リモートの変更を取り込んでリベース' },
                        { cmd: 'git push origin main', desc: '再度プッシュ' }
                    ],
                    when: 'コミット履歴を綺麗に保ちたい場合',
                    dangerLevel: 'warning',
                    warning: '⚠️ コンフリクトが発生する可能性があります'
                }
            ]
        }
    ]
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReverseLookupDatabase;
}
