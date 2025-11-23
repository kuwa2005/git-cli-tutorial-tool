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
            prerequisites: '💡 最後のコミットが何か確認したい場合は、まず「git log --oneline」で履歴を見てみましょう。一番上に表示されるのが最後のコミットです。',
            relatedTasks: ['check-commit-history', 'fix-commit-message', 'add-to-last-commit'],
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
            prerequisites: '💡 本当にプッシュ済みか確認するには「git log origin/main」でリモートの履歴を見ましょう。ローカルとリモートの差分は「git log origin/main..HEAD」で確認できます。',
            relatedTasks: ['undo-last-commit', 'check-commit-history', 'common-push-issues'],
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
            prerequisites: '💡 何がステージングされているか確認するには「git status」を実行しましょう。緑色で表示されているファイルがステージング済みです。',
            relatedTasks: ['check-status', 'undo-last-commit'],
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
            prerequisites: '💡 どのコミットを修正するか確認するには「git log --oneline -5」で最近のコミット履歴を見ましょう。',
            relatedTasks: ['undo-last-commit', 'add-to-last-commit', 'check-commit-history'],
            nextSteps: '✨ メッセージ修正後、まだプッシュしていなければそのままプッシュできます。既にプッシュ済みの場合は、チームメンバーへの影響を考慮してください。',
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
            prerequisites: '💡 どのファイルが最後のコミットに含まれているか確認するには「git show --name-only」を実行しましょう。',
            relatedTasks: ['fix-commit-message', 'undo-last-commit', 'check-status'],
            nextSteps: '✨ ファイルを追加したら、必要に応じてコミットメッセージも修正できます（--amendに-mオプションを追加）。',
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
            prerequisites: '💡 現在どのブランチにいるか、どのディレクトリにいるかを把握しておきましょう。',
            relatedTasks: ['check-commit-history', 'check-diff', 'undo-staging'],
            nextSteps: '✨ 変更内容を確認したら、「git add」でステージング→「git commit」でコミットの流れです。詳しい差分は「git diff」で確認できます。',
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
            prerequisites: '💡 変更されているファイルがあるか「git status」で確認してから実行すると分かりやすいです。',
            relatedTasks: ['check-status', 'undo-staging', 'check-commit-history'],
            nextSteps: '✨ 変更内容を確認して問題なければ「git add」→「git commit」でコミットしましょう。修正が必要ならファイルを編集してください。',
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
            prerequisites: '💡 コミット履歴は「最新が上、古いのが下」に表示されます。ハッシュ値（英数字の文字列）が各コミットの識別子です。',
            relatedTasks: ['undo-last-commit', 'fix-commit-message', 'check-status'],
            nextSteps: '✨ 履歴を見て問題を見つけたら、「コミットを取り消したい」や「コミットメッセージを修正したい」を参照してください。',
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
            prerequisites: '💡 upstreamリモートが設定されているか確認するには「git remote -v」を実行しましょう。upstreamが表示されない場合は先に追加が必要です。',
            relatedTasks: ['add-remote', 'pull-latest', 'check-remote'],
            nextSteps: '✨ 同期後は、自分のフィーチャーブランチをリベースして最新のmainに合わせることを検討しましょう。',
            solutions: [
                {
                    title: 'GitHub CLI で同期（最も簡単）',
                    commands: [
                        { cmd: 'gh repo sync', desc: '【状況】他人のリポジトリをフォークして作業しているが、フォーク元が更新されたので最新の状態に追いつきたい\n【実行すると】GitHub CLIが自動的にフォーク元の最新の変更を取得して、自分のフォーク（GitHub上）とローカルの両方を更新します\n【結果】フォーク元、自分のGitHubフォーク、ローカルリポジトリがすべて同じ最新の状態になります\n【メリット】複雑なコマンドを覚えなくても、1コマンドで完結' }
                    ],
                    when: 'GitHub CLI がインストール済みの場合',
                    dangerLevel: 'safe'
                },
                {
                    title: 'Git コマンドで同期',
                    commands: [
                        { cmd: 'git fetch upstream', desc: '【実行すると】upstreamリモート（フォーク元のリポジトリ）から最新のコミット履歴を取得します。ただし、まだローカルのファイルには反映されません\n【結果】upstream/mainという名前で最新の状態が保存されます' },
                        { cmd: 'git checkout main', desc: '【実行すると】作業中のブランチをmainブランチに切り替えます' },
                        { cmd: 'git merge upstream/main', desc: '【実行すると】取得したupstream/main（フォーク元の最新）を現在のmainブランチに統合します\n【結果】ローカルのmainブランチがフォーク元の最新状態になります' },
                        { cmd: 'git push origin main', desc: '【実行すると】更新したローカルのmainブランチを自分のGitHubフォーク（origin）に送信します\n【結果】GitHubの自分のフォークも最新状態になります' }
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
            prerequisites: '💡 プル前に「git status」で未コミットの変更がないか確認しましょう。変更がある場合は先にコミットしてください。',
            relatedTasks: ['sync-fork', 'check-status', 'resolve-conflicts'],
            nextSteps: '✨ プル後にコンフリクト（競合）が発生した場合は、ファイルを編集して解決し、「git add」→「git commit」で完了します。',
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
            prerequisites: '💡 現在どのブランチにいるか「git branch」で確認しましょう。新しいブランチは現在のブランチから分岐します。',
            relatedTasks: ['switch-branch', 'check-status', 'merge-branch'],
            nextSteps: '✨ ブランチを作成したら、そのブランチで作業を進めて、完了したらmainにマージします。リモートにプッシュする場合は「git push -u origin ブランチ名」を使います。',
            solutions: [
                {
                    title: 'ブランチを作成して切り替え',
                    commands: [
                        { cmd: 'git checkout -b feature-branch', desc: '【状況】新しい機能を開発したいので、mainブランチとは別の作業ブランチを作りたい\n【実行すると】現在いるブランチ（通常はmain）から分岐して、feature-branchという名前の新しいブランチを作成し、同時にそのブランチに切り替わります\n【結果】feature-branchで作業を開始できます。ここで行う変更はmainブランチには影響しません\n【例】新機能開発：git checkout -b feature/user-auth、バグ修正：git checkout -b fix/login-bug' },
                        { cmd: 'git switch -c feature-branch', desc: '【実行すると】checkoutと同じことをしますが、より新しく分かりやすいコマンドです\n【違い】switchはブランチ操作専用なので、間違ってファイルを変更してしまうリスクがありません\n【推奨】Git 2.23以降を使っている場合はこちらが推奨' }
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
            prerequisites: '💡 切り替え前に「git status」で未コミットの変更がないか確認しましょう。変更がある場合は先にコミットするか「git stash」で退避してください。',
            relatedTasks: ['stash-changes', 'create-branch', 'check-status'],
            nextSteps: '✨ ブランチを切り替えたら、「git log」で履歴を確認したり、「git status」で状態を確認してから作業を始めましょう。',
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
            prerequisites: '💡 退避する前に「git status」で現在の変更を確認しましょう。stashは未追跡（untracked）ファイルは保存しません。',
            relatedTasks: ['check-status', 'switch-branch', 'create-branch'],
            nextSteps: '✨ stash後にブランチ切り替えをして作業が終わったら、元のブランチに戻って「git stash pop」で変更を復元しましょう。',
            solutions: [
                {
                    title: '変更の一時退避',
                    commands: [
                        { cmd: 'git stash', desc: '【状況】作業中に急に別のブランチに切り替える必要が出たが、今の変更はまだコミットしたくない（中途半端な状態）\n【実行すると】現在の変更（ステージング済み＋未ステージングの両方）を一時的に「避難所」に保存して、作業ディレクトリをクリーンな状態に戻します\n【結果】git statusで確認すると「変更なし」と表示されます。別のブランチに安全に切り替えられます。変更内容は失われず、後で復元できます\n【例】feature-aで作業中→緊急バグ修正が必要→stashで退避→mainに切り替えて修正→feature-aに戻ってstash pop' },
                        { cmd: 'git stash save "作業内容の説明"', desc: '【実行すると】stashと同じですが、「ログイン画面のUI作業中」などメモを付けられます\n【メリット】複数の退避がある場合に、どれがどの作業か分かりやすくなります' }
                    ],
                    when: 'ブランチを切り替える前に変更を保存したい',
                    dangerLevel: 'safe'
                },
                {
                    title: '退避した変更を戻す',
                    commands: [
                        { cmd: 'git stash list', desc: '【実行すると】今まで退避した変更の一覧を表示します\n【表示例】stash@{0}: WIP on feature-a: 作業内容の説明\n【結果】どの退避を復元すべきか確認できます' },
                        { cmd: 'git stash pop', desc: '【実行すると】最新の退避（stash@{0}）を現在のブランチに適用し、同時に退避リストから削除します\n【結果】ファイルが退避前の編集中の状態に戻ります。もう一度作業を続けられます\n【使い分け】復元後にもう同じ退避は不要な場合（通常はこちら）' },
                        { cmd: 'git stash apply', desc: '【実行すると】最新の退避を適用しますが、退避リストからは削除しません\n【結果】変更は復元されますが、stash listには残ったまま。複数のブランチで同じ変更を試したい時に便利\n【使い分け】同じ変更を別のブランチでも試したい場合' }
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
            prerequisites: '💡 GitHubのリポジトリページで「Code」ボタンをクリックすると、クローン用のURLが表示されます（HTTPSまたはSSH）。',
            relatedTasks: ['push-local-changes', 'check-remote', 'setup-upstream'],
            nextSteps: '✨ クローン後は、作成されたフォルダに移動（cd コマンド）してから作業を始めましょう。「git status」で状態を確認できます。',
            solutions: [
                {
                    title: 'HTTPSでクローン（推奨）',
                    commands: [
                        { cmd: 'git clone https://github.com/owner/repo.git', desc: '【状況】GitHubのリポジトリをローカルPCにダウンロードして作業を始めたい場合\n【実行すると】指定したURLのリポジトリ全体（すべてのファイル、履歴、ブランチ）をローカルにコピーします。リポジトリ名と同じ名前のフォルダが自動作成されます\n【結果】repo/というフォルダができて、その中にすべてのファイルがダウンロードされます。自動的にoriginリモートも設定されます\n【例】https://github.com/facebook/react.git → reactフォルダができる' },
                        { cmd: 'git clone https://github.com/owner/repo.git my-folder', desc: '【実行すると】クローンしますが、フォルダ名を自分で指定できます\n【結果】repo/ではなくmy-folder/という名前でフォルダができます\n【例】長いリポジトリ名を短い名前に変えたい場合に便利' }
                    ],
                    when: '通常のクローン（認証はGitHub CLIまたはトークンで）',
                    dangerLevel: 'safe'
                },
                {
                    title: 'SSHでクローン',
                    commands: [
                        { cmd: 'git clone git@github.com:owner/repo.git', desc: '【状況】SSHキーを設定済みで、パスワード入力なしでクローンしたい場合\n【実行すると】SSH認証を使ってリポジトリをクローンします。HTTPSと同じくすべてのファイルと履歴がダウンロードされます\n【メリット】毎回パスワードを入力する必要がありません\n【前提条件】GitHub にSSH公開鍵を登録済みであること' }
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
            prerequisites: '💡 初めてプッシュする場合は「初回セットアップ」を先に見てください。リモートの設定は「git remote -v」で確認できます。',
            relatedTasks: ['first-time-setup-after-clone', 'check-before-push', 'check-remote', 'common-push-issues'],
            nextSteps: '✨ プッシュ後は、GitHubのWebページで変更が反映されているか確認しましょう。問題があれば「プッシュがrejectedされた」を参照してください。',
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
