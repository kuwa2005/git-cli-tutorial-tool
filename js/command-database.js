/**
 * Git & GitHub CLI Command Database
 * コマンドの詳細情報、危険度、説明などを管理
 */

const CommandDatabase = {
    // ========================================
    // Git Commands
    // ========================================
    git: {
        // ----- 情報確認系（安全） -----
        status: {
            description: '現在のワーキングツリーの状態を表示します',
            dangerLevel: 'safe',
            category: 'info',
            options: {
                '-s': 'ショート形式で表示',
                '--short': 'ショート形式で表示',
                '-b': 'ブランチ情報も表示',
                '--branch': 'ブランチ情報も表示'
            },
            explanation: 'どのファイルが変更されているか、ステージングされているか、コミット可能かを確認できます。',
            examples: [
                'git status',
                'git status -s'
            ]
        },

        log: {
            description: 'コミット履歴を表示します',
            dangerLevel: 'safe',
            category: 'info',
            options: {
                '--oneline': '各コミットを1行で表示',
                '--graph': 'グラフ形式で表示',
                '--all': 'すべてのブランチを表示',
                '-n': '表示するコミット数を指定'
            },
            explanation: 'リポジトリの履歴を確認できます。ブランチの状態を把握するのに役立ちます。',
            examples: [
                'git log',
                'git log --oneline --graph --all'
            ]
        },

        diff: {
            description: '変更内容の差分を表示します',
            dangerLevel: 'safe',
            category: 'info',
            options: {
                '--cached': 'ステージング済みの変更を表示',
                '--staged': 'ステージング済みの変更を表示',
                'HEAD': '最新コミットとの差分'
            },
            explanation: 'ファイルの変更内容を詳しく確認できます。コミット前の確認に便利です。',
            examples: [
                'git diff',
                'git diff --staged',
                'git diff HEAD'
            ]
        },

        remote: {
            description: 'リモートリポジトリの情報を表示・管理します',
            dangerLevel: 'safe',
            category: 'info',
            options: {
                '-v': '詳細情報を表示',
                '--verbose': '詳細情報を表示',
                'add': 'リモートを追加',
                'remove': 'リモートを削除'
            },
            explanation: 'origin, upstream などのリモートリポジトリの設定を確認できます。',
            examples: [
                'git remote -v',
                'git remote add upstream <url>'
            ],
            warnings: {
                'upstream': {
                    level: 'info',
                    message: 'upstreamはフォーク元のリポジトリを指します。通常はプルのみに使用します。'
                }
            }
        },

        // ----- 変更操作系（注意） -----
        add: {
            description: 'ファイルをステージングエリアに追加します',
            dangerLevel: 'caution',
            category: 'staging',
            options: {
                '.': 'すべての変更をステージング',
                '-A': 'すべての変更（削除含む）をステージング',
                '--all': 'すべての変更（削除含む）をステージング',
                '-p': '対話的にステージング',
                '--patch': '対話的にステージング'
            },
            explanation: 'コミットする前にファイルをステージングエリアに追加します。',
            examples: [
                'git add ファイル名',
                'git add .',
                'git add -A'
            ]
        },

        commit: {
            description: 'ステージングされた変更をコミットします',
            dangerLevel: 'caution',
            category: 'commit',
            options: {
                '-m': 'コミットメッセージを指定',
                '-a': 'すべての変更を自動ステージング',
                '--amend': '直前のコミットを修正',
                '--no-verify': 'フックをスキップ（非推奨）'
            },
            explanation: 'ステージングエリアの変更を確定してリポジトリに記録します。',
            examples: [
                'git commit -m "コミットメッセージ"',
                'git commit -am "変更をコミット"'
            ],
            warnings: {
                '--amend': {
                    level: 'warning',
                    message: '既にプッシュ済みのコミットを修正すると、プッシュ時にコンフリクトが発生します。'
                }
            }
        },

        push: {
            description: 'ローカルの変更をリモートリポジトリに送信します',
            dangerLevel: 'warning',
            category: 'remote',
            options: {
                '-u': '上流ブランチを設定',
                '--set-upstream': '上流ブランチを設定',
                '-f': '強制プッシュ（危険）',
                '--force': '強制プッシュ（危険）',
                '--force-with-lease': '安全な強制プッシュ',
                '--all': 'すべてのブランチをプッシュ',
                '--tags': 'タグもプッシュ'
            },
            explanation: 'ローカルのコミットをリモートリポジトリに反映します。',
            examples: [
                'git push origin ブランチ名',
                'git push -u origin feature-branch'
            ],
            warnings: {
                'upstream': {
                    level: 'critical',
                    message: 'フォーク元（upstream）への直接プッシュは通常行いません！代わりにPull Requestを作成してください。'
                },
                'main': {
                    level: 'warning',
                    message: 'mainブランチへの直接プッシュは推奨されません。Pull Requestベースのワークフローを検討してください。'
                },
                'master': {
                    level: 'warning',
                    message: 'masterブランチへの直接プッシュは推奨されません。Pull Requestベースのワークフローを検討してください。'
                },
                '--force': {
                    level: 'critical',
                    message: '強制プッシュは他の人の作業を破壊する可能性があります！本当に必要か再確認してください。'
                },
                '-f': {
                    level: 'critical',
                    message: '強制プッシュは他の人の作業を破壊する可能性があります！本当に必要か再確認してください。'
                }
            }
        },

        pull: {
            description: 'リモートリポジトリの変更を取得してマージします',
            dangerLevel: 'caution',
            category: 'remote',
            options: {
                '--rebase': 'マージではなくリベース',
                '--ff-only': 'Fast-forwardのみ許可',
                '--no-commit': 'マージをコミットしない'
            },
            explanation: 'リモートの変更をローカルに取り込みます。fetchとmergeを同時に行います。',
            examples: [
                'git pull origin main',
                'git pull --rebase'
            ]
        },

        fetch: {
            description: 'リモートリポジトリの変更を取得します（マージはしない）',
            dangerLevel: 'safe',
            category: 'remote',
            options: {
                '--all': 'すべてのリモートから取得',
                '--prune': '削除されたブランチを整理',
                '-p': '削除されたブランチを整理'
            },
            explanation: 'リモートの最新状態を確認します。ローカルブランチは変更されません。',
            examples: [
                'git fetch origin',
                'git fetch --all --prune'
            ]
        },

        // ----- ブランチ操作系 -----
        branch: {
            description: 'ブランチの作成・表示・削除を行います',
            dangerLevel: 'caution',
            category: 'branch',
            options: {
                '-a': 'すべてのブランチを表示',
                '--all': 'すべてのブランチを表示',
                '-d': 'ブランチを削除（マージ済みのみ）',
                '-D': 'ブランチを強制削除',
                '-m': 'ブランチ名を変更'
            },
            explanation: 'ブランチの管理を行います。',
            examples: [
                'git branch',
                'git branch 新しいブランチ名',
                'git branch -d 削除するブランチ名'
            ],
            warnings: {
                '-D': {
                    level: 'warning',
                    message: 'マージされていないブランチを削除します。作業内容が失われる可能性があります。'
                }
            }
        },

        checkout: {
            description: 'ブランチを切り替えたり、ファイルを復元します',
            dangerLevel: 'warning',
            category: 'branch',
            options: {
                '-b': '新しいブランチを作成して切り替え',
                '--': 'ファイルを復元（変更を破棄）'
            },
            explanation: 'ブランチの切り替えやファイルの復元を行います。',
            examples: [
                'git checkout ブランチ名',
                'git checkout -b 新しいブランチ名',
                'git checkout -- ファイル名'
            ],
            warnings: {
                '--': {
                    level: 'warning',
                    message: 'ファイルの変更が失われます。復元できません。'
                }
            }
        },

        switch: {
            description: 'ブランチを切り替えます（checkout の新しいコマンド）',
            dangerLevel: 'caution',
            category: 'branch',
            options: {
                '-c': '新しいブランチを作成して切り替え',
                '--create': '新しいブランチを作成して切り替え'
            },
            explanation: 'ブランチの切り替えに特化したコマンドです。checkoutより安全です。',
            examples: [
                'git switch ブランチ名',
                'git switch -c 新しいブランチ名'
            ]
        },

        merge: {
            description: '指定したブランチを現在のブランチにマージします',
            dangerLevel: 'warning',
            category: 'branch',
            options: {
                '--no-ff': 'Fast-forwardをせずにマージコミットを作成',
                '--squash': 'コミットをまとめてマージ',
                '--abort': 'マージを中止'
            },
            explanation: '別のブランチの変更を取り込みます。コンフリクトが発生する可能性があります。',
            examples: [
                'git merge feature-branch',
                'git merge --no-ff feature-branch'
            ]
        },

        // ----- 履歴操作系（危険） -----
        reset: {
            description: 'コミットを取り消したり、ステージングを解除します',
            dangerLevel: 'critical',
            category: 'history',
            options: {
                '--soft': 'コミットのみ取り消し（変更は保持）',
                '--mixed': 'コミットとステージングを取り消し（デフォルト）',
                '--hard': 'すべてを完全に取り消し（危険）'
            },
            explanation: 'コミット履歴やステージング状態を変更します。',
            examples: [
                'git reset HEAD~1',
                'git reset --soft HEAD~1',
                'git reset --hard HEAD~1'
            ],
            warnings: {
                '--hard': {
                    level: 'critical',
                    message: '変更内容が完全に失われます！元に戻せません！'
                }
            }
        },

        rebase: {
            description: 'コミット履歴を書き換えます',
            dangerLevel: 'critical',
            category: 'history',
            options: {
                '-i': '対話的リベース',
                '--interactive': '対話的リベース',
                '--continue': 'リベースを続行',
                '--abort': 'リベースを中止'
            },
            explanation: 'コミットを整理したり、別のブランチに付け替えたりします。',
            examples: [
                'git rebase main',
                'git rebase -i HEAD~3'
            ],
            warnings: {
                'default': {
                    level: 'critical',
                    message: '既にプッシュ済みのブランチをrebaseすると、他の人の作業に影響を与えます！'
                }
            }
        },

        // ----- その他操作 -----
        clone: {
            description: 'リモートリポジトリを複製します',
            dangerLevel: 'safe',
            category: 'repo',
            options: {
                '--depth': '指定した数のコミットのみクローン',
                '--branch': '特定のブランチをクローン',
                '-b': '特定のブランチをクローン'
            },
            explanation: 'リモートリポジトリをローカルにコピーします。',
            examples: [
                'git clone https://github.com/user/repo.git',
                'git clone --depth 1 https://github.com/user/repo.git'
            ]
        },

        init: {
            description: '新しいGitリポジトリを初期化します',
            dangerLevel: 'safe',
            category: 'repo',
            options: {
                '--bare': 'Bareリポジトリを作成'
            },
            explanation: '現在のディレクトリをGitリポジトリとして初期化します。',
            examples: [
                'git init',
                'git init プロジェクト名'
            ]
        },

        clean: {
            description: '追跡されていないファイルを削除します',
            dangerLevel: 'critical',
            category: 'cleanup',
            options: {
                '-f': '強制削除',
                '-d': 'ディレクトリも削除',
                '-n': 'ドライラン（削除されるファイルを表示）',
                '-x': '.gitignoreされたファイルも削除'
            },
            explanation: '未追跡のファイルを削除します。元に戻せません！',
            examples: [
                'git clean -n',
                'git clean -fd'
            ],
            warnings: {
                'default': {
                    level: 'critical',
                    message: '削除されたファイルは復元できません！まず -n で確認してください。'
                }
            }
        },

        stash: {
            description: '作業中の変更を一時保存します',
            dangerLevel: 'caution',
            category: 'workspace',
            options: {
                'push': '変更を保存',
                'pop': '保存した変更を復元',
                'list': '保存リストを表示',
                'drop': '保存を削除',
                'clear': 'すべての保存を削除'
            },
            explanation: '作業中の変更を一時的に退避させます。',
            examples: [
                'git stash',
                'git stash pop',
                'git stash list'
            ]
        }
    },

    // ========================================
    // GitHub CLI Commands
    // ========================================
    gh: {
        pr: {
            description: 'Pull Requestを管理します',
            dangerLevel: 'caution',
            category: 'github',
            subcommands: {
                'create': 'Pull Requestを作成',
                'list': 'Pull Requestを一覧表示',
                'view': 'Pull Requestを表示',
                'checkout': 'Pull Requestをチェックアウト',
                'merge': 'Pull Requestをマージ',
                'close': 'Pull Requestをクローズ'
            },
            options: {
                '--base': 'マージ先のブランチを指定',
                '--head': 'マージ元のブランチを指定',
                '--title': 'PRのタイトルを指定',
                '--body': 'PRの説明を指定',
                '--web': 'ブラウザで開く'
            },
            explanation: 'GitHub上でPull Requestの操作を行います。',
            examples: [
                'gh pr create',
                'gh pr list',
                'gh pr view 123'
            ]
        },

        issue: {
            description: 'Issueを管理します',
            dangerLevel: 'safe',
            category: 'github',
            subcommands: {
                'create': 'Issueを作成',
                'list': 'Issueを一覧表示',
                'view': 'Issueを表示',
                'close': 'Issueをクローズ'
            },
            options: {
                '--title': 'Issueのタイトルを指定',
                '--body': 'Issueの説明を指定',
                '--label': 'ラベルを追加',
                '--assignee': '担当者を指定'
            },
            explanation: 'GitHub上でIssueの操作を行います。',
            examples: [
                'gh issue create',
                'gh issue list',
                'gh issue view 123'
            ]
        },

        repo: {
            description: 'リポジトリを管理します',
            dangerLevel: 'caution',
            category: 'github',
            subcommands: {
                'create': 'リポジトリを作成',
                'fork': 'リポジトリをフォーク',
                'clone': 'リポジトリをクローン',
                'view': 'リポジトリを表示'
            },
            options: {
                '--public': 'パブリックリポジトリとして作成',
                '--private': 'プライベートリポジトリとして作成'
            },
            explanation: 'GitHub上でリポジトリの操作を行います。',
            examples: [
                'gh repo create',
                'gh repo fork owner/repo',
                'gh repo view'
            ]
        }
    },

    /**
     * 危険度レベルの定義
     */
    dangerLevels: {
        safe: {
            label: '安全',
            icon: '🟢',
            description: '読み取り専用の操作です。データに影響を与えません。'
        },
        caution: {
            label: '注意',
            icon: '🟡',
            description: 'データを変更しますが、通常の操作です。慎重に実行してください。'
        },
        warning: {
            label: '危険',
            icon: '🔴',
            description: '重要な変更を行います。影響をよく理解してから実行してください。'
        },
        critical: {
            label: '非常に危険',
            icon: '⛔',
            description: 'データが失われる可能性があります。本当に必要か再確認してください！'
        }
    },

    /**
     * カテゴリの定義
     */
    categories: {
        info: { label: '情報確認', icon: '🔍' },
        staging: { label: 'ステージング', icon: '📦' },
        commit: { label: 'コミット', icon: '💾' },
        remote: { label: 'リモート操作', icon: '☁️' },
        branch: { label: 'ブランチ', icon: '🌿' },
        history: { label: '履歴操作', icon: '📜' },
        repo: { label: 'リポジトリ', icon: '📁' },
        workspace: { label: 'ワークスペース', icon: '🗂️' },
        cleanup: { label: 'クリーンアップ', icon: '🧹' },
        github: { label: 'GitHub', icon: '🐙' }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CommandDatabase;
}
