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
                        { cmd: 'git reset --soft HEAD~1', desc: 'コミットを取り消すが、変更はステージングエリアに残る' }
                    ],
                    when: 'まだプッシュしていない場合',
                    dangerLevel: 'safe'
                },
                {
                    title: '変更もすべて取り消す',
                    commands: [
                        { cmd: 'git reset --hard HEAD~1', desc: 'コミットと変更をすべて削除（復元不可）' }
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
                        { cmd: 'git revert HEAD', desc: '最後のコミットを打ち消す新しいコミットを作成' },
                        { cmd: 'git push origin main', desc: '打ち消しコミットをプッシュ' }
                    ],
                    when: '履歴を保持したい場合（チーム開発では必須）',
                    dangerLevel: 'safe'
                },
                {
                    title: '強制的に履歴を書き換える',
                    commands: [
                        { cmd: 'git reset --hard HEAD~1', desc: 'ローカルでコミットを削除' },
                        { cmd: 'git push --force origin main', desc: 'リモートに強制プッシュ' }
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
                        { cmd: 'git restore --staged <file>', desc: '特定のファイルのステージングを解除' },
                        { cmd: 'git restore --staged .', desc: 'すべてのファイルのステージングを解除' }
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
                        { cmd: 'git commit --amend -m "新しいメッセージ"', desc: '最後のコミットメッセージを書き換える' }
                    ],
                    when: 'まだプッシュしていない場合',
                    dangerLevel: 'safe'
                },
                {
                    title: 'プッシュ済みのメッセージを修正',
                    commands: [
                        { cmd: 'git commit --amend -m "新しいメッセージ"', desc: 'ローカルでメッセージを修正' },
                        { cmd: 'git push --force-with-lease origin main', desc: '安全な強制プッシュ' }
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
                        { cmd: 'git add forgotten-file.txt', desc: '忘れたファイルをステージング' },
                        { cmd: 'git commit --amend --no-edit', desc: 'メッセージを変えずにコミットを修正' }
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
        }
    ]
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReverseLookupDatabase;
}
