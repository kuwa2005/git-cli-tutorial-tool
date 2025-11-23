/**
 * Wizard Data & Logic
 * ステップバイステップのウィザードコース定義
 */

const WizardData = {
    /**
     * 初めてのリポジトリコース
     */
    'first-repo': {
        title: '初めてのリポジトリ',
        description: 'リポジトリの作成から最初のプッシュまでを学びます',
        difficulty: 'beginner',
        estimatedTime: '15分',
        steps: [
            {
                id: 'intro',
                title: 'はじめに',
                type: 'info',
                content: `
                    <h3>🎯 このコースで学ぶこと</h3>
                    <p>新しいGitリポジトリを作成し、最初のコミットをして、GitHubにプッシュするまでの基本的な流れを学びます。</p>
                    <ul>
                        <li>✅ ローカルリポジトリの初期化</li>
                        <li>✅ ファイルの追加とコミット</li>
                        <li>✅ GitHubリポジトリの作成</li>
                        <li>✅ リモートへのプッシュ</li>
                    </ul>
                    <div class="info-box">
                        <strong>💡 前提条件:</strong>
                        <ul>
                            <li>Gitがインストールされている</li>
                            <li>GitHubアカウントを持っている</li>
                            <li>GitHub CLI (gh) がインストールされている（オプション）</li>
                        </ul>
                    </div>
                `
            },
            {
                id: 'init',
                title: 'ステップ1: リポジトリを初期化',
                type: 'command',
                content: `
                    <p>まず、プロジェクトのディレクトリを作成し、Gitリポジトリとして初期化します。</p>
                `,
                commands: [
                    {
                        command: 'mkdir my-first-project',
                        explanation: '新しいディレクトリ（フォルダ）を作成します'
                    },
                    {
                        command: 'cd my-first-project',
                        explanation: '作成したディレクトリに移動します'
                    },
                    {
                        command: 'git init',
                        explanation: 'このディレクトリをGitリポジトリとして初期化します',
                        highlight: true
                    }
                ],
                expectedOutput: 'Initialized empty Git repository in /path/to/my-first-project/.git/',
                verification: `
                    <h4>✅ 確認方法</h4>
                    <p>以下のコマンドを実行して、正しく初期化されたか確認してください：</p>
                    <code>git status</code>
                    <p>「On branch main」または「On branch master」と表示されればOKです。</p>
                `
            },
            {
                id: 'first-file',
                title: 'ステップ2: 最初のファイルを作成',
                type: 'command',
                content: `
                    <p>README.md ファイルを作成して、プロジェクトの説明を書きましょう。</p>
                `,
                commands: [
                    {
                        command: 'echo "# My First Project" > README.md',
                        explanation: 'README.md ファイルを作成し、プロジェクト名を書き込みます',
                        highlight: true
                    }
                ],
                note: '💡 テキストエディタで README.md を開いて、好きな内容を書いてもOKです！',
                verification: `
                    <h4>✅ 確認方法</h4>
                    <code>git status</code>
                    <p>「Untracked files」に README.md が表示されればOKです。</p>
                `
            },
            {
                id: 'add',
                title: 'ステップ3: ファイルをステージング',
                type: 'command',
                content: `
                    <p>作成したファイルをステージングエリアに追加します。これは「コミットする準備ができた」という意味です。</p>
                `,
                commands: [
                    {
                        command: 'git add README.md',
                        explanation: 'README.md をステージングエリアに追加',
                        highlight: true
                    }
                ],
                diagram: `
                    <div class="flow-diagram">
                        <div class="flow-step">📝 Working Directory</div>
                        <div class="flow-arrow">git add →</div>
                        <div class="flow-step active">📦 Staging Area</div>
                        <div class="flow-arrow">git commit →</div>
                        <div class="flow-step">💾 Repository</div>
                    </div>
                `,
                verification: `
                    <h4>✅ 確認方法</h4>
                    <code>git status</code>
                    <p>「Changes to be committed」に README.md が表示されればOKです。</p>
                `
            },
            {
                id: 'commit',
                title: 'ステップ4: 最初のコミット',
                type: 'command',
                content: `
                    <p>ステージングした変更をコミット（確定）します。コミットメッセージは変更内容を簡潔に説明します。</p>
                `,
                commands: [
                    {
                        command: 'git commit -m "Initial commit: Add README"',
                        explanation: '変更をコミットし、メッセージを付けます',
                        highlight: true
                    }
                ],
                tip: `
                    <div class="tip-box">
                        <strong>💡 良いコミットメッセージの書き方</strong>
                        <ul>
                            <li>何を変更したか簡潔に書く</li>
                            <li>動詞で始める（Add, Fix, Update など）</li>
                            <li>50文字以内が理想</li>
                        </ul>
                    </div>
                `,
                verification: `
                    <h4>✅ 確認方法</h4>
                    <code>git log</code>
                    <p>コミット履歴が表示されればOKです。</p>
                `
            },
            {
                id: 'github-create',
                title: 'ステップ5: GitHubリポジトリを作成',
                type: 'choice',
                content: `
                    <p>ローカルのリポジトリをGitHubにプッシュするため、GitHubにリモートリポジトリを作成します。</p>
                    <p><strong>2つの方法があります：</strong></p>
                `,
                choices: [
                    {
                        id: 'gh-cli',
                        title: 'GitHub CLI (gh) を使う方法（推奨）',
                        icon: '⚡',
                        content: `
                            <p>GitHub CLI を使うと、コマンドライン上で簡単にリポジトリを作成できます。</p>
                        `,
                        commands: [
                            {
                                command: 'gh repo create my-first-project --public --source=. --remote=origin --push',
                                explanation: 'GitHubにリポジトリを作成し、現在のコードをプッシュします',
                                highlight: true
                            }
                        ],
                        note: '💡 --public でパブリックリポジトリ、--private でプライベートリポジトリになります'
                    },
                    {
                        id: 'manual',
                        title: 'GitHubウェブサイトで手動作成',
                        icon: '🌐',
                        content: `
                            <p>GitHubのウェブサイトから手動でリポジトリを作成する方法です。</p>
                            <ol>
                                <li>GitHub.com にログイン</li>
                                <li>右上の「+」ボタンから「New repository」を選択</li>
                                <li>リポジトリ名を入力（例: my-first-project）</li>
                                <li>Public または Private を選択</li>
                                <li>「Create repository」をクリック</li>
                            </ol>
                        `,
                        commands: [
                            {
                                command: 'git remote add origin https://github.com/あなたのユーザー名/my-first-project.git',
                                explanation: 'リモートリポジトリを追加',
                                highlight: true
                            },
                            {
                                command: 'git branch -M main',
                                explanation: 'ブランチ名を main に変更（必要な場合）'
                            },
                            {
                                command: 'git push -u origin main',
                                explanation: '初回プッシュ',
                                highlight: true
                            }
                        ]
                    }
                ]
            },
            {
                id: 'verify',
                title: 'ステップ6: 確認',
                type: 'info',
                content: `
                    <h3>🎉 おめでとうございます！</h3>
                    <p>最初のGitリポジトリをGitHubにプッシュすることができました！</p>

                    <h4>✅ 確認事項</h4>
                    <ul>
                        <li>GitHubのリポジトリページで README.md が表示されているか</li>
                        <li>コミット履歴が正しく反映されているか</li>
                    </ul>

                    <h4>📚 次のステップ</h4>
                    <p>これで基本的なワークフローを理解できました。次は以下を学びましょう：</p>
                    <ul>
                        <li>🌿 ブランチを使った開発（ブランチワークフローコース）</li>
                        <li>🤝 他のプロジェクトへのコントリビュート（OSSコントリビュートコース）</li>
                    </ul>

                    <div class="success-box">
                        <strong>🎓 学んだこと</strong>
                        <ul>
                            <li>git init - リポジトリの初期化</li>
                            <li>git add - ファイルのステージング</li>
                            <li>git commit - 変更のコミット</li>
                            <li>git push - リモートへのプッシュ</li>
                        </ul>
                    </div>
                `
            }
        ]
    },

    /**
     * ブランチワークフローコース
     */
    'branch-workflow': {
        title: 'ブランチワークフロー',
        description: 'ブランチを使った開発の流れを学びます',
        difficulty: 'intermediate',
        estimatedTime: '20分',
        steps: [
            {
                id: 'intro',
                title: 'ブランチとは？',
                type: 'info',
                content: `
                    <h3>🌿 ブランチを使うメリット</h3>
                    <p>ブランチを使うことで、メインの開発ラインに影響を与えずに新しい機能を開発できます。</p>

                    <div class="info-box">
                        <strong>💡 ブランチが役立つ場面：</strong>
                        <ul>
                            <li>新機能を開発する時</li>
                            <li>バグを修正する時</li>
                            <li>実験的な変更を試す時</li>
                            <li>複数の機能を並行して開発する時</li>
                        </ul>
                    </div>

                    <h4>📊 ブランチの流れ</h4>
                    <div class="workflow-diagram">
                        <pre>
main     : ●━━━━━━━━━━●━━━━━━━━━━●
                ╲         ╱
feature  :       ●━━●━━●
                        </pre>
                    </div>
                `
            },
            {
                id: 'create-branch',
                title: 'ステップ1: 新しいブランチを作成',
                type: 'command',
                content: `
                    <p>新機能用のブランチを作成して、そのブランチに切り替えます。</p>
                `,
                commands: [
                    {
                        command: 'git checkout -b feature/add-footer',
                        explanation: '新しいブランチを作成して、そのブランチに切り替えます',
                        highlight: true
                    }
                ],
                alternative: `
                    <p><strong>または、より新しいコマンド：</strong></p>
                    <code>git switch -c feature/add-footer</code>
                `,
                verification: `
                    <h4>✅ 確認方法</h4>
                    <code>git branch</code>
                    <p>現在のブランチに * が付いているか確認してください。</p>
                `
            },
            {
                id: 'make-changes',
                title: 'ステップ2: 変更を加える',
                type: 'command',
                content: `
                    <p>新しいブランチで作業を進めます。ファイルを追加したり、編集したりしましょう。</p>
                `,
                commands: [
                    {
                        command: 'echo "<footer>Copyright 2024</footer>" > footer.html',
                        explanation: '新しいファイルを作成'
                    },
                    {
                        command: 'git add footer.html',
                        explanation: 'ファイルをステージング'
                    },
                    {
                        command: 'git commit -m "Add footer component"',
                        explanation: '変更をコミット',
                        highlight: true
                    }
                ]
            },
            {
                id: 'push-branch',
                title: 'ステップ3: ブランチをプッシュ',
                type: 'command',
                content: `
                    <p>ローカルのブランチをGitHubにプッシュします。</p>
                `,
                commands: [
                    {
                        command: 'git push -u origin feature/add-footer',
                        explanation: 'ブランチをリモートにプッシュし、追跡設定します',
                        highlight: true
                    }
                ],
                note: '💡 -u オプションで、このブランチとリモートブランチを紐付けます'
            },
            {
                id: 'create-pr',
                title: 'ステップ4: Pull Requestを作成',
                type: 'choice',
                content: `
                    <p>変更をメインブランチに取り込むため、Pull Request (PR) を作成します。</p>
                `,
                choices: [
                    {
                        id: 'gh-cli',
                        title: 'GitHub CLI を使う',
                        commands: [
                            {
                                command: 'gh pr create --title "Add footer component" --body "Added a new footer to the page"',
                                explanation: 'Pull Requestを作成',
                                highlight: true
                            }
                        ]
                    },
                    {
                        id: 'manual',
                        title: 'GitHubウェブサイトで作成',
                        content: `
                            <ol>
                                <li>GitHubのリポジトリページにアクセス</li>
                                <li>「Compare & pull request」ボタンをクリック</li>
                                <li>タイトルと説明を入力</li>
                                <li>「Create pull request」をクリック</li>
                            </ol>
                        `
                    }
                ]
            },
            {
                id: 'merge',
                title: 'ステップ5: マージする',
                type: 'info',
                content: `
                    <h3>🔀 Pull Requestをマージ</h3>
                    <p>レビューが完了したら、Pull Requestをマージして変更をmainブランチに取り込みます。</p>

                    <h4>方法1: GitHubウェブサイト</h4>
                    <p>Pull Requestページで「Merge pull request」ボタンをクリック</p>

                    <h4>方法2: ローカルでマージ（上級者向け）</h4>
                    <div class="code-block">
                        <code>git checkout main</code><br>
                        <code>git merge feature/add-footer</code><br>
                        <code>git push origin main</code>
                    </div>

                    <div class="warning-box">
                        <strong>⚠️ 注意:</strong> 本番環境では、レビューなしにマージしないでください！
                    </div>
                `
            },
            {
                id: 'cleanup',
                title: 'ステップ6: ブランチを削除',
                type: 'command',
                content: `
                    <p>マージが完了したら、不要になったブランチを削除します。</p>
                `,
                commands: [
                    {
                        command: 'git checkout main',
                        explanation: 'mainブランチに切り替え'
                    },
                    {
                        command: 'git branch -d feature/add-footer',
                        explanation: 'ローカルブランチを削除',
                        highlight: true
                    },
                    {
                        command: 'git push origin --delete feature/add-footer',
                        explanation: 'リモートブランチを削除（オプション）'
                    }
                ],
                note: '💡 GitHubでPRをマージすると、自動的にリモートブランチを削除するオプションがあります'
            }
        ]
    },

    /**
     * OSSコントリビュートコース
     */
    'fork-contribute': {
        title: 'OSSコントリビュート',
        description: 'Forkからプルリクエストまでの完全ガイド',
        difficulty: 'intermediate',
        estimatedTime: '25分',
        steps: [
            {
                id: 'intro',
                title: 'OSSへのコントリビュートとは',
                type: 'info',
                content: `
                    <h3>🤝 オープンソースへの貢献</h3>
                    <p>他の人のプロジェクトに貢献する際は、直接プッシュできないため、Fork（複製）して作業します。</p>

                    <div class="workflow-diagram">
                        <pre>
Upstream (元)  : ●━━━━━━━━━━●
                  ╲           ╱
Origin (あなた): ●━━●━━●━━●
                      ╲   ╱
Local (ローカル): ●━━●━━●
                        </pre>
                    </div>

                    <h4>📋 作業の流れ</h4>
                    <ol>
                        <li>🍴 リポジトリをFork</li>
                        <li>💾 ローカルにClone</li>
                        <li>🌿 ブランチを作成</li>
                        <li>✏️ 変更を加える</li>
                        <li>⬆️ 自分のForkにPush</li>
                        <li>📬 Pull Requestを作成</li>
                    </ol>
                `
            },
            {
                id: 'fork',
                title: 'ステップ1: リポジトリをFork',
                type: 'choice',
                content: `
                    <p>まず、コントリビュートしたいリポジトリを自分のアカウントにFork（複製）します。</p>
                `,
                choices: [
                    {
                        id: 'gh-cli',
                        title: 'GitHub CLI を使う',
                        commands: [
                            {
                                command: 'gh repo fork owner/repository --clone',
                                explanation: 'リポジトリをForkして、同時にCloneします',
                                highlight: true
                            }
                        ]
                    },
                    {
                        id: 'manual',
                        title: 'GitHubウェブサイトでFork',
                        content: `
                            <ol>
                                <li>元のリポジトリのGitHubページにアクセス</li>
                                <li>右上の「Fork」ボタンをクリック</li>
                                <li>自分のアカウントを選択</li>
                                <li>「Create fork」をクリック</li>
                            </ol>
                            <p>その後、Cloneします：</p>
                            <code>git clone https://github.com/あなたのユーザー名/repository.git</code>
                        `
                    }
                ]
            },
            {
                id: 'upstream',
                title: 'ステップ2: Upstreamを設定',
                type: 'command',
                content: `
                    <p>元のリポジトリ（upstream）を追加して、最新の変更を取得できるようにします。</p>
                `,
                commands: [
                    {
                        command: 'cd repository',
                        explanation: 'プロジェクトディレクトリに移動'
                    },
                    {
                        command: 'git remote add upstream https://github.com/元の所有者/repository.git',
                        explanation: '元のリポジトリをupstreamとして追加',
                        highlight: true
                    },
                    {
                        command: 'git remote -v',
                        explanation: 'リモート設定を確認'
                    }
                ],
                expectedOutput: `
origin    https://github.com/あなた/repository.git (fetch)
origin    https://github.com/あなた/repository.git (push)
upstream  https://github.com/元の所有者/repository.git (fetch)
upstream  https://github.com/元の所有者/repository.git (push)
                `,
                note: '💡 origin = あなたのFork、upstream = 元のリポジトリ'
            },
            {
                id: 'sync',
                title: 'ステップ3: 最新の状態に同期',
                type: 'command',
                content: `
                    <p>作業を始める前に、元のリポジトリの最新の変更を取得します。</p>
                `,
                commands: [
                    {
                        command: 'git fetch upstream',
                        explanation: 'upstreamの最新状態を取得'
                    },
                    {
                        command: 'git checkout main',
                        explanation: 'mainブランチに切り替え'
                    },
                    {
                        command: 'git merge upstream/main',
                        explanation: 'upstreamのmainブランチをマージ',
                        highlight: true
                    }
                ],
                tip: `
                    <div class="tip-box">
                        <strong>💡 定期的に同期:</strong>
                        <p>作業中も定期的にupstreamから最新の変更を取得しましょう。コンフリクトを減らせます。</p>
                    </div>
                `
            },
            {
                id: 'branch-and-work',
                title: 'ステップ4: ブランチを作成して作業',
                type: 'command',
                content: `
                    <p>新しいブランチを作成して、変更を加えます。</p>
                `,
                commands: [
                    {
                        command: 'git checkout -b fix/typo-in-readme',
                        explanation: '新しいブランチを作成',
                        highlight: true
                    },
                    {
                        command: '# ファイルを編集...',
                        explanation: 'エディタでファイルを編集します'
                    },
                    {
                        command: 'git add .',
                        explanation: '変更をステージング'
                    },
                    {
                        command: 'git commit -m "Fix typo in README"',
                        explanation: '変更をコミット',
                        highlight: true
                    }
                ],
                note: '💡 ブランチ名は変更内容がわかるようにしましょう（例: fix/..., feature/..., docs/...）'
            },
            {
                id: 'push-to-fork',
                title: 'ステップ5: 自分のForkにPush',
                type: 'command',
                content: `
                    <p>変更を自分のFork（origin）にプッシュします。</p>
                    <div class="warning-box">
                        <strong>🚨 重要:</strong> upstreamではなく、originにプッシュしてください！
                    </div>
                `,
                commands: [
                    {
                        command: 'git push -u origin fix/typo-in-readme',
                        explanation: '自分のFork（origin）にプッシュ',
                        highlight: true
                    }
                ],
                wrong: `
                    <div class="error-box">
                        <strong>❌ 間違い:</strong>
                        <code>git push upstream fix/typo-in-readme</code>
                        <p>upstreamへの直接プッシュはできません（権限がありません）</p>
                    </div>
                `
            },
            {
                id: 'create-pr',
                title: 'ステップ6: Pull Requestを作成',
                type: 'command',
                content: `
                    <p>自分のForkから元のリポジトリに対してPull Requestを作成します。</p>
                `,
                commands: [
                    {
                        command: 'gh pr create --repo 元の所有者/repository --title "Fix typo in README" --body "Fixed a typo in the installation section"',
                        explanation: 'Pull Requestを作成',
                        highlight: true
                    }
                ],
                alternative: `
                    <h4>または、GitHubウェブサイトで：</h4>
                    <ol>
                        <li>自分のForkのGitHubページにアクセス</li>
                        <li>「Compare & pull request」ボタンをクリック</li>
                        <li>base repository が元のリポジトリになっているか確認</li>
                        <li>タイトルと詳細な説明を入力</li>
                        <li>「Create pull request」をクリック</li>
                    </ol>
                `,
                tip: `
                    <div class="tip-box">
                        <strong>💡 良いPRの書き方:</strong>
                        <ul>
                            <li>何を変更したか明確に説明</li>
                            <li>なぜその変更が必要か理由を書く</li>
                            <li>スクリーンショットを添付（UI変更の場合）</li>
                            <li>関連するIssue番号を記載</li>
                        </ul>
                    </div>
                `
            },
            {
                id: 'after-pr',
                title: 'ステップ7: レビュー後の対応',
                type: 'info',
                content: `
                    <h3>📝 レビューを待つ</h3>
                    <p>Pull Requestを作成したら、メンテナーのレビューを待ちます。</p>

                    <h4>レビューで変更を求められたら</h4>
                    <ol>
                        <li>同じブランチで修正を加える</li>
                        <li>コミットしてプッシュ（PRに自動的に反映されます）</li>
                    </ol>
                    <div class="code-block">
                        <code>git add .</code><br>
                        <code>git commit -m "Address review comments"</code><br>
                        <code>git push origin fix/typo-in-readme</code>
                    </div>

                    <h4>🎉 マージされたら</h4>
                    <p>おめでとうございます！あなたの変更がプロジェクトに取り込まれました。</p>
                    <ul>
                        <li>ローカルブランチを削除できます</li>
                        <li>mainブランチを最新に更新しましょう</li>
                    </ul>

                    <div class="success-box">
                        <strong>🎓 OSSコントリビューターになりました！</strong>
                        <p>これであなたもオープンソースコミュニティの一員です。</p>
                    </div>
                `
            }
        ]
    },

    /**
     * コンフリクト解決コース
     */
    'conflict-resolve': {
        title: 'コンフリクト解決',
        description: 'マージコンフリクトの対処法を学びます',
        difficulty: 'advanced',
        estimatedTime: '30分',
        steps: [
            {
                id: 'intro',
                title: 'コンフリクトとは？',
                type: 'info',
                content: `
                    <h3>⚔️ マージコンフリクトについて</h3>
                    <p>同じファイルの同じ場所を複数人が異なる方法で変更すると、Gitは自動的にマージできなくなります。これがコンフリクトです。</p>

                    <div class="info-box">
                        <strong>💡 コンフリクトが発生する場面:</strong>
                        <ul>
                            <li>複数人が同じファイルを編集した時</li>
                            <li>ブランチをマージする時</li>
                            <li>古いブランチを最新のmainにマージする時</li>
                        </ul>
                    </div>

                    <h4>😱 怖がらないで！</h4>
                    <p>コンフリクトは正常な現象です。落ち着いて対処すれば解決できます。</p>
                `
            },
            {
                id: 'understand',
                title: 'ステップ1: コンフリクトを理解する',
                type: 'info',
                content: `
                    <h3>🔍 コンフリクトマーカー</h3>
                    <p>コンフリクトが発生すると、ファイル内にマーカーが表示されます：</p>
                    <div class="code-block">
                        <pre>
<<<<<<< HEAD
あなたの変更
=======
他の人の変更（またはmainブランチの内容）
>>>>>>> feature-branch
                        </pre>
                    </div>

                    <ul>
                        <li><code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</code>: 現在のブランチの内容の開始</li>
                        <li><code>=======</code>: 区切り線</li>
                        <li><code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code>: マージしようとしているブランチの内容の終了</li>
                    </ul>
                `
            },
            {
                id: 'detect',
                title: 'ステップ2: コンフリクトを検出',
                type: 'command',
                content: `
                    <p>マージやプル時にコンフリクトが発生すると、Gitがメッセージを表示します。</p>
                `,
                commands: [
                    {
                        command: 'git status',
                        explanation: 'コンフリクトが発生しているファイルを確認',
                        highlight: true
                    }
                ],
                expectedOutput: `
Unmerged paths:
  (use "git add <file>..." to mark resolution)
        both modified:   index.html
                `
            },
            {
                id: 'resolve',
                title: 'ステップ3: コンフリクトを解決',
                type: 'info',
                content: `
                    <h3>✏️ 解決方法</h3>
                    <p>コンフリクトマーカーを手動で編集して、正しい内容にします。</p>

                    <h4>選択肢：</h4>
                    <ol>
                        <li><strong>片方を採用:</strong> どちらか一方の変更のみを残す</li>
                        <li><strong>両方を採用:</strong> 両方の変更を組み合わせる</li>
                        <li><strong>新しい内容:</strong> 完全に新しい内容に書き換える</li>
                    </ol>

                    <h4>例:</h4>
                    <div class="code-block">
                        <strong>コンフリクト発生:</strong>
                        <pre>
<<<<<<< HEAD
<h1>Welcome to My Site</h1>
=======
<h1>Welcome to Our Website</h1>
>>>>>>> feature-branch
                        </pre>

                        <strong>解決後:</strong>
                        <pre>
<h1>Welcome to Our Website</h1>
                        </pre>
                    </div>

                    <div class="tip-box">
                        <strong>💡 ツールを使う:</strong>
                        <p>VS Code、GitKraken、Sourcetreeなどのツールを使うと、視覚的にコンフリクトを解決できます。</p>
                    </div>
                `
            },
            {
                id: 'mark-resolved',
                title: 'ステップ4: 解決済みとしてマーク',
                type: 'command',
                content: `
                    <p>コンフリクトを解決したら、そのファイルをステージングして解決済みとしてマークします。</p>
                `,
                commands: [
                    {
                        command: 'git add index.html',
                        explanation: '解決したファイルをステージング',
                        highlight: true
                    },
                    {
                        command: 'git status',
                        explanation: '状態を確認'
                    }
                ]
            },
            {
                id: 'complete',
                title: 'ステップ5: マージを完了',
                type: 'command',
                content: `
                    <p>すべてのコンフリクトを解決したら、マージをコミットして完了します。</p>
                `,
                commands: [
                    {
                        command: 'git commit',
                        explanation: 'マージコミットを作成（メッセージは自動生成されます）',
                        highlight: true
                    }
                ],
                note: '💡 マージコミットメッセージはGitが自動的に生成するので、通常はそのまま使用します'
            },
            {
                id: 'abort',
                title: '番外編: マージを中止する',
                type: 'command',
                content: `
                    <p>コンフリクトの解決が難しい場合、マージを中止して元の状態に戻すことができます。</p>
                `,
                commands: [
                    {
                        command: 'git merge --abort',
                        explanation: 'マージを中止して元の状態に戻す',
                        highlight: true
                    }
                ],
                warning: `
                    <div class="warning-box">
                        <strong>⚠️ 注意:</strong> これまでの解決作業は失われます。
                    </div>
                `
            },
            {
                id: 'prevention',
                title: 'コンフリクトを防ぐ方法',
                type: 'info',
                content: `
                    <h3>🛡️ コンフリクトを最小限にする</h3>

                    <div class="tip-box">
                        <strong>ベストプラクティス:</strong>
                        <ul>
                            <li>✅ 頻繁にmainブランチから最新を取得</li>
                            <li>✅ 小さな変更を頻繁にコミット</li>
                            <li>✅ ブランチを長期間保持しない</li>
                            <li>✅ 作業前にチームメンバーと調整</li>
                            <li>✅ 同じファイルの作業を避ける</li>
                        </ul>
                    </div>

                    <h4>定期的な同期</h4>
                    <div class="code-block">
                        <code>git fetch origin</code><br>
                        <code>git merge origin/main</code>
                    </div>
                    <p>または</p>
                    <div class="code-block">
                        <code>git pull origin main</code>
                    </div>

                    <div class="success-box">
                        <strong>🎓 まとめ:</strong>
                        <p>コンフリクトは怖くありません！落ち着いて一つずつ解決していけば大丈夫です。</p>
                    </div>
                `
            }
        ]
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WizardData;
}
