/**
 * Main Application
 * UIとの連携、イベントハンドリング、状態管理を行う
 */

class GitWizardApp {
    constructor() {
        this.analyzer = new CommandAnalyzer(CommandDatabase);
        this.currentTab = 'analyzer';
        this.settings = this.loadSettings();
        this.currentWizard = null;
        this.currentStep = 0;
        this.init();
    }

    /**
     * アプリケーション初期化
     */
    init() {
        this.setupEventListeners();
        this.applySettings();
        this.initializeReference();
        this.setupCommandBuilder();
        this.setupWizard();
    }

    /**
     * イベントリスナーを設定
     */
    setupEventListeners() {
        // タブ切り替え
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // コマンド解析
        const analyzeBtn = document.getElementById('analyzeBtn');
        const clearBtn = document.getElementById('clearBtn');
        const commandInput = document.getElementById('commandInput');

        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => {
                this.analyzeCommand();
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                commandInput.value = '';
                this.hideAnalysisResults();
            });
        }

        if (commandInput) {
            // Enterキーで解析（Shift+Enterで改行）
            commandInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.analyzeCommand();
                }
            });
        }

        // ダークモード切り替え
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // 言語切り替え（将来的に実装）
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.changeLanguage(e.target.value);
            });
        }

        // コマンドコピー
        const copyCommandBtn = document.getElementById('copyCommandBtn');
        if (copyCommandBtn) {
            copyCommandBtn.addEventListener('click', () => {
                this.copyGeneratedCommand();
            });
        }

        // サンプルコマンド選択
        const sampleCommandSelect = document.getElementById('sampleCommandSelect');
        if (sampleCommandSelect) {
            sampleCommandSelect.addEventListener('change', (e) => {
                const selectedCommand = e.target.value;
                if (selectedCommand) {
                    commandInput.value = selectedCommand;
                    // 自動的に解析を実行
                    this.analyzeCommand();
                    // 選択をリセット
                    e.target.value = '';
                }
            });
        }

        // トップへ戻るボタン
        const scrollToTopBtn = document.getElementById('scrollToTopBtn');
        if (scrollToTopBtn) {
            scrollToTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // ヘッダータイトルクリックでページリロード
        const headerTitle = document.querySelector('.header h1');
        if (headerTitle) {
            headerTitle.style.cursor = 'pointer';
            headerTitle.addEventListener('click', () => {
                window.location.reload();
            });
        }
    }

    /**
     * タブを切り替え
     */
    switchTab(tabName) {
        // すべてのタブとコンテンツを非アクティブ化
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // 選択されたタブとコンテンツをアクティブ化
        const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
        const selectedContent = document.getElementById(tabName);

        if (selectedTab) selectedTab.classList.add('active');
        if (selectedContent) selectedContent.classList.add('active');

        this.currentTab = tabName;
    }

    /**
     * コマンドを解析
     */
    analyzeCommand() {
        const input = document.getElementById('commandInput');
        const commandString = input.value.trim();

        if (!commandString) {
            this.showError('コマンドを入力してください');
            return;
        }

        // 解析実行
        const result = this.analyzer.analyze(commandString);

        if (result.error) {
            this.showError(result.error, result.suggestion);
            return;
        }

        // 結果を表示
        this.displayAnalysisResults(result);
    }

    /**
     * 解析結果を表示
     */
    displayAnalysisResults(result) {
        const resultsContainer = document.getElementById('analysisResults');
        resultsContainer.classList.remove('hidden');

        // 警告セクション
        this.displayWarnings(result.warnings);

        // 説明セクション
        this.displayExplanation(result.explanation);

        // 危険度セクション
        this.displayDangerLevel(result.dangerLevel);

        // 代替案セクション
        this.displayAlternatives(result.alternatives);

        // 元に戻す方法セクション
        this.displayUndoMethod(result.undoMethod);

        // スムーズにスクロール
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /**
     * 警告を表示
     */
    displayWarnings(warnings) {
        const warningSection = document.getElementById('warningSection');

        if (!warnings || warnings.length === 0) {
            warningSection.classList.add('hidden');
            return;
        }

        warningSection.classList.remove('hidden');
        warningSection.innerHTML = '';

        warnings.forEach(warning => {
            const warningBox = document.createElement('div');
            warningBox.className = `warning-box warning-${warning.level}`;

            let html = `
                <div class="warning-box-header">
                    <span class="warning-icon">${this.getWarningIcon(warning.level)}</span>
                    <span>${warning.message}</span>
                </div>
                <div class="warning-content">
            `;

            if (warning.detail) {
                html += `<p><strong>詳細:</strong> ${warning.detail}</p>`;
            }

            if (warning.recommendations && warning.recommendations.length > 0) {
                html += '<p><strong>推奨事項:</strong></p><ul class="warning-list">';
                warning.recommendations.forEach(rec => {
                    html += `<li>${rec}</li>`;
                });
                html += '</ul>';
            }

            if (warning.correctCommands && warning.correctCommands.length > 0) {
                html += '<p><strong>推奨コマンド:</strong></p>';
                warning.correctCommands.forEach(cmd => {
                    html += `<code style="display: block; margin: 0.5rem 0; padding: 0.5rem; background: var(--bg-primary); border-radius: 4px;">${cmd}</code>`;
                });
            }

            html += '</div>';
            warningBox.innerHTML = html;
            warningSection.appendChild(warningBox);
        });
    }

    /**
     * 警告アイコンを取得
     */
    getWarningIcon(level) {
        const icons = {
            'critical': '🚨',
            'warning': '⚠️',
            'caution': '⚡',
            'info': 'ℹ️'
        };
        return icons[level] || '⚠️';
    }

    /**
     * 説明を表示
     */
    displayExplanation(explanation) {
        const explanationContent = document.getElementById('explanationContent');

        let html = `<p style="margin-bottom: 1rem;">${explanation.summary}</p>`;

        if (explanation.breakdown && explanation.breakdown.length > 0) {
            html += '<div class="command-breakdown">';
            explanation.breakdown.forEach(part => {
                html += `
                    <div class="command-part">
                        <div class="command-part-name">${this.escapeHtml(part.part)}</div>
                        <div class="command-part-desc">${part.description}</div>
                    </div>
                `;
            });
            html += '</div>';
        }

        if (explanation.examples && explanation.examples.length > 0) {
            html += '<p style="margin-top: 1rem;"><strong>使用例:</strong></p>';
            explanation.examples.forEach(example => {
                html += `<code style="display: block; margin: 0.5rem 0; padding: 0.5rem; background: var(--bg-primary); border-radius: 4px;">${this.escapeHtml(example)}</code>`;
            });
        }

        explanationContent.innerHTML = html;
    }

    /**
     * 危険度を表示
     */
    displayDangerLevel(dangerLevel) {
        const dangerContent = document.getElementById('dangerContent');

        const html = `
            <div class="danger-badge danger-${dangerLevel.level}">
                <span>${dangerLevel.icon}</span>
                <span>${dangerLevel.label}</span>
            </div>
            <p>${dangerLevel.description}</p>
        `;

        dangerContent.innerHTML = html;
    }

    /**
     * 代替案を表示
     */
    displayAlternatives(alternatives) {
        const alternativesSection = document.getElementById('alternativesSection');

        if (!alternatives || alternatives.length === 0) {
            alternativesSection.classList.add('hidden');
            return;
        }

        alternativesSection.classList.remove('hidden');
        const alternativesContent = document.getElementById('alternativesContent');

        let html = '';
        alternatives.forEach(alt => {
            html += `
                <div class="alternative-cmd">
                    <code>${this.escapeHtml(alt.command)}</code>
                    <p><strong>${alt.reason}</strong></p>
                    <p>${alt.description}</p>
                </div>
            `;
        });

        alternativesContent.innerHTML = html;
    }

    /**
     * 元に戻す方法を表示
     */
    displayUndoMethod(undoMethod) {
        const undoSection = document.getElementById('undoSection');

        if (!undoMethod) {
            undoSection.classList.add('hidden');
            return;
        }

        undoSection.classList.remove('hidden');
        const undoContent = document.getElementById('undoContent');

        let html = `
            <code style="display: block; margin: 1rem 0; padding: 0.75rem; background: var(--bg-primary); border-radius: 4px; font-size: 1.1rem;">${this.escapeHtml(undoMethod.command)}</code>
            <p>${undoMethod.description}</p>
        `;

        if (undoMethod.warning) {
            html += `<p style="color: var(--color-warning); margin-top: 0.5rem;"><strong>注意:</strong> ${undoMethod.warning}</p>`;
        }

        undoContent.innerHTML = html;
    }

    /**
     * 解析結果を非表示
     */
    hideAnalysisResults() {
        const resultsContainer = document.getElementById('analysisResults');
        resultsContainer.classList.add('hidden');
    }

    /**
     * エラーを表示
     */
    showError(message, suggestion) {
        const resultsContainer = document.getElementById('analysisResults');
        resultsContainer.classList.remove('hidden');

        const warningSection = document.getElementById('warningSection');
        warningSection.classList.remove('hidden');
        warningSection.innerHTML = `
            <div class="warning-box warning-high">
                <div class="warning-box-header">
                    <span class="warning-icon">❌</span>
                    <span>${message}</span>
                </div>
                ${suggestion ? `<div class="warning-content"><p>${suggestion}</p></div>` : ''}
            </div>
        `;

        // 他のセクションを非表示
        document.getElementById('explanationSection').style.display = 'none';
        document.getElementById('dangerSection').style.display = 'none';
        document.getElementById('alternativesSection').classList.add('hidden');
        document.getElementById('undoSection').classList.add('hidden');
    }

    /**
     * コマンドビルダーを設定
     */
    setupCommandBuilder() {
        const scenarioSelect = document.getElementById('scenarioSelect');

        if (scenarioSelect) {
            scenarioSelect.addEventListener('change', (e) => {
                this.handleScenarioChange(e.target.value);
            });
        }

        // ビジュアルボタンのイベントリスナー
        const scenarioButtons = document.querySelectorAll('.scenario-btn');
        scenarioButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // 選択状態を更新
                scenarioButtons.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');

                // シナリオを処理
                const scenario = btn.dataset.scenario;
                this.handleScenarioChange(scenario);

                // ドロップダウンも同期
                if (scenarioSelect) {
                    scenarioSelect.value = scenario;
                }

                // パラメータフォームまでスムーズにスクロール
                setTimeout(() => {
                    const parameterForm = document.getElementById('parameterForm');
                    if (parameterForm && !parameterForm.classList.contains('hidden')) {
                        parameterForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                }, 100);
            });
        });
    }

    /**
     * シナリオ変更時の処理
     */
    handleScenarioChange(scenario) {
        const parameterForm = document.getElementById('parameterForm');
        const generatedCommand = document.getElementById('generatedCommand');

        if (!scenario) {
            parameterForm.classList.add('hidden');
            generatedCommand.classList.add('hidden');
            return;
        }

        // シナリオに応じたフォームを生成
        const formFields = this.getFormFieldsForScenario(scenario);
        this.renderParameterForm(formFields, scenario);
    }

    /**
     * シナリオに応じたフォームフィールドを取得
     */
    getFormFieldsForScenario(scenario) {
        const scenarios = {
            'init': [
                { name: 'repoName', label: 'リポジトリ名（オプション）', type: 'text', placeholder: 'my-project' }
            ],
            'clone': [
                { name: 'url', label: 'リポジトリURL', type: 'text', placeholder: 'https://github.com/user/repo.git', required: true }
            ],
            'fork': [
                { name: 'repo', label: 'フォークするリポジトリ', type: 'text', placeholder: 'owner/repo', required: true }
            ],
            'add': [
                { name: 'files', label: 'ファイル名（. ですべて）', type: 'text', placeholder: 'file.txt または .', required: true }
            ],
            'commit': [
                { name: 'message', label: 'コミットメッセージ', type: 'text', placeholder: '変更内容を簡潔に説明', required: true },
                { name: 'addAll', label: 'すべての変更を含める (-a)', type: 'checkbox' }
            ],
            'push': [
                { name: 'remote', label: 'リモート名', type: 'select', options: ['origin', 'upstream'], default: 'origin' },
                { name: 'branch', label: 'ブランチ名', type: 'text', placeholder: 'main', required: true },
                { name: 'setUpstream', label: '上流ブランチを設定 (-u)', type: 'checkbox' }
            ],
            'branch-create': [
                { name: 'branchName', label: '新しいブランチ名', type: 'text', placeholder: 'feature/new-feature', required: true },
                { name: 'switchTo', label: '作成後に切り替える', type: 'checkbox', default: true }
            ],
            'branch-switch': [
                { name: 'branchName', label: 'ブランチ名', type: 'text', placeholder: 'main', required: true }
            ],
            'branch-delete': [
                { name: 'branchName', label: '削除するブランチ名', type: 'text', placeholder: 'feature-branch', required: true },
                { name: 'force', label: '強制削除 (-D)', type: 'checkbox' }
            ],
            'merge': [
                { name: 'branchName', label: 'マージするブランチ名', type: 'text', placeholder: 'feature-branch', required: true },
                { name: 'noFf', label: 'Fast-forwardしない (--no-ff)', type: 'checkbox' }
            ],
            'pull': [
                { name: 'remote', label: 'リモート名', type: 'select', options: ['origin', 'upstream'], default: 'origin' },
                { name: 'branch', label: 'ブランチ名', type: 'text', placeholder: 'main', required: true }
            ],
            'fetch': [
                { name: 'remote', label: 'リモート名（空欄で全て）', type: 'text', placeholder: 'origin' },
                { name: 'prune', label: '削除されたブランチを整理 (--prune)', type: 'checkbox' }
            ],
            'sync-fork': [
                { name: 'branch', label: '同期するブランチ', type: 'text', placeholder: 'main', default: 'main' }
            ],
            'pr-create': [
                { name: 'title', label: 'Pull Requestのタイトル', type: 'text', placeholder: 'Add new feature' },
                { name: 'base', label: 'マージ先ブランチ', type: 'text', placeholder: 'main', default: 'main' }
            ],
            'issue-create': [
                { name: 'title', label: 'Issueのタイトル', type: 'text', placeholder: 'Bug: Something is broken', required: true }
            ],
            'local-to-github': [
                { name: 'repoName', label: 'リポジトリ名', type: 'text', placeholder: 'my-project', required: true },
                { name: 'visibility', label: '公開設定', type: 'select', options: ['public', 'private'], default: 'public' },
                { name: 'autoRemote', label: 'リモートを自動設定', type: 'checkbox', default: true }
            ],
            'setup-upstream': [
                { name: 'upstreamOwner', label: 'フォーク元のオーナー名', type: 'text', placeholder: 'original-owner', required: true },
                { name: 'upstreamRepo', label: 'フォーク元のリポジトリ名', type: 'text', placeholder: 'repo-name', required: true }
            ],
            'sync-with-upstream': [
                { name: 'branch', label: '同期するブランチ', type: 'text', placeholder: 'main', default: 'main' },
                { name: 'strategy', label: '同期方法', type: 'select', options: ['merge', 'rebase'], default: 'merge' }
            ],
            'create-pr-from-fork': [
                { name: 'sourceBranch', label: 'あなたのブランチ', type: 'text', placeholder: 'feature-branch', required: true },
                { name: 'targetBranch', label: 'マージ先ブランチ', type: 'text', placeholder: 'main', default: 'main' },
                { name: 'upstreamRepo', label: 'フォーク元リポジトリ', type: 'text', placeholder: 'owner/repo', required: true }
            ],
            'github-to-local': [
                { name: 'repoUrl', label: 'GitHubリポジトリURL', type: 'text', placeholder: 'https://github.com/owner/repo.git', required: true },
                { name: 'localDir', label: 'ローカルディレクトリ名（省略可）', type: 'text', placeholder: 'my-project' }
            ],
            'local-changes-push': [
                { name: 'files', label: '変更したファイル（. で全て）', type: 'text', placeholder: '.', default: '.' },
                { name: 'commitMessage', label: 'コミットメッセージ', type: 'text', placeholder: 'Update files', required: true },
                { name: 'branch', label: 'プッシュ先ブランチ', type: 'text', placeholder: 'main', default: 'main' }
            ]
        };

        return scenarios[scenario] || [];
    }

    /**
     * パラメータフォームをレンダリング
     */
    renderParameterForm(fields, scenario) {
        const parameterForm = document.getElementById('parameterForm');
        parameterForm.classList.remove('hidden');

        let html = '<form id="commandForm">';

        fields.forEach(field => {
            html += '<div class="form-group">';
            html += `<label for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>`;

            if (field.type === 'text') {
                html += `<input type="text" id="${field.name}" name="${field.name}" class="form-input" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''} value="${field.default || ''}">`;
            } else if (field.type === 'checkbox') {
                html += `<input type="checkbox" id="${field.name}" name="${field.name}" ${field.default ? 'checked' : ''}>`;
            } else if (field.type === 'select') {
                html += `<select id="${field.name}" name="${field.name}" class="select-input">`;
                field.options.forEach(option => {
                    html += `<option value="${option}" ${option === field.default ? 'selected' : ''}>${option}</option>`;
                });
                html += '</select>';
            }

            if (field.hint) {
                html += `<small class="form-hint">${field.hint}</small>`;
            }

            html += '</div>';
        });

        html += '<button type="submit" class="btn btn-primary">コマンドを生成</button>';
        html += '</form>';

        parameterForm.innerHTML = html;

        // フォーム送信イベント
        const form = document.getElementById('commandForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.generateCommand(scenario, new FormData(form));
        });

        // リアルタイムプレビュー
        form.addEventListener('input', () => {
            this.generateCommand(scenario, new FormData(form), true);
        });
    }

    /**
     * コマンドを生成
     */
    generateCommand(scenario, formData, isPreview = false) {
        const command = this.buildCommand(scenario, formData);

        if (!command) return;

        const generatedCommand = document.getElementById('generatedCommand');
        const commandOutput = document.getElementById('commandOutput');
        const builderExplanation = document.getElementById('builderExplanation');

        generatedCommand.classList.remove('hidden');
        commandOutput.textContent = command;

        // コマンドの解説を表示
        const result = this.analyzer.analyze(command);
        if (result.success) {
            builderExplanation.innerHTML = `
                <p><strong>このコマンドは:</strong> ${result.explanation.summary}</p>
                ${result.dangerLevel.level !== 'safe' ? `<p style="color: var(--color-warning); margin-top: 0.5rem;">⚠️ ${result.dangerLevel.description}</p>` : ''}
            `;
        }
    }

    /**
     * シナリオに応じたコマンドを構築
     */
    buildCommand(scenario, formData) {
        const data = Object.fromEntries(formData);

        const commands = {
            'init': () => {
                return data.repoName ? `git init ${data.repoName}` : 'git init';
            },
            'clone': () => {
                return `git clone ${data.url}`;
            },
            'fork': () => {
                return `gh repo fork ${data.repo}`;
            },
            'add': () => {
                return `git add ${data.files}`;
            },
            'commit': () => {
                const flags = data.addAll ? '-am' : '-m';
                return `git commit ${flags} "${data.message}"`;
            },
            'push': () => {
                const flags = data.setUpstream ? '-u' : '';
                return `git push ${flags} ${data.remote} ${data.branch}`.trim();
            },
            'branch-create': () => {
                return data.switchTo ? `git checkout -b ${data.branchName}` : `git branch ${data.branchName}`;
            },
            'branch-switch': () => {
                return `git switch ${data.branchName}`;
            },
            'branch-delete': () => {
                const flag = data.force ? '-D' : '-d';
                return `git branch ${flag} ${data.branchName}`;
            },
            'merge': () => {
                const flags = data.noFf ? '--no-ff' : '';
                return `git merge ${flags} ${data.branchName}`.trim();
            },
            'pull': () => {
                return `git pull ${data.remote} ${data.branch}`;
            },
            'fetch': () => {
                const flags = data.prune ? '--prune' : '';
                const remote = data.remote || '--all';
                return `git fetch ${remote} ${flags}`.trim();
            },
            'sync-fork': () => {
                return `git fetch upstream && git checkout ${data.branch || 'main'} && git merge upstream/${data.branch || 'main'}`;
            },
            'status': () => 'git status',
            'log': () => 'git log --oneline --graph',
            'diff': () => 'git diff',
            'remote': () => 'git remote -v',
            'pr-create': () => {
                let cmd = 'gh pr create';
                if (data.title) cmd += ` --title "${data.title}"`;
                if (data.base) cmd += ` --base ${data.base}`;
                return cmd;
            },
            'pr-list': () => 'gh pr list',
            'issue-create': () => {
                return `gh issue create --title "${data.title}"`;
            },
            'issue-list': () => 'gh issue list',
            'local-to-github': () => {
                const visibility = data.visibility === 'private' ? '--private' : '--public';
                const remote = data.autoRemote ? '--source=. --remote=origin' : '';
                return `gh repo create ${data.repoName} ${visibility} ${remote}`.trim();
            },
            'setup-upstream': () => {
                return `git remote add upstream https://github.com/${data.upstreamOwner}/${data.upstreamRepo}.git`;
            },
            'sync-with-upstream': () => {
                const branch = data.branch || 'main';
                if (data.strategy === 'rebase') {
                    return `git fetch upstream && git rebase upstream/${branch}`;
                } else {
                    return `git fetch upstream && git merge upstream/${branch}`;
                }
            },
            'create-pr-from-fork': () => {
                const target = data.targetBranch || 'main';
                return `git push origin ${data.sourceBranch} && gh pr create --repo ${data.upstreamRepo} --base ${target} --head ${data.sourceBranch}`;
            },
            'github-to-local': () => {
                if (data.localDir) {
                    return `git clone ${data.repoUrl} ${data.localDir}`;
                } else {
                    return `git clone ${data.repoUrl}`;
                }
            },
            'local-changes-push': () => {
                const branch = data.branch || 'main';
                return `git add ${data.files} && git commit -m "${data.commitMessage}" && git push origin ${branch}`;
            }
        };

        return commands[scenario] ? commands[scenario]() : '';
    }

    /**
     * 生成されたコマンドをコピー
     */
    copyGeneratedCommand() {
        const commandOutput = document.getElementById('commandOutput');
        const text = commandOutput.textContent;

        navigator.clipboard.writeText(text).then(() => {
            const btn = document.getElementById('copyCommandBtn');
            const originalText = btn.textContent;
            btn.textContent = '✓ コピーしました！';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        });
    }

    /**
     * リファレンスを初期化
     */
    initializeReference() {
        this.activeCategory = 'all';
        this.activeDanger = 'all';
        this.currentSearchQuery = '';
        this.activeReverseCategory = 'all';
        this.reverseLookupSearchQuery = '';

        this.renderReference();

        // サブタブ切り替え
        const referenceTabs = document.querySelectorAll('.reference-tab');
        referenceTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                referenceTabs.forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');

                const targetTab = e.target.dataset.refTab;
                document.querySelectorAll('.reference-tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(targetTab).classList.add('active');

                // 逆引きタブに切り替えたら、逆引きリファレンスをレンダリング
                if (targetTab === 'reverse-lookup') {
                    this.renderReverseLookup();
                }
            });
        });

        const searchInput = document.getElementById('referenceSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentSearchQuery = e.target.value;
                this.renderReference();
            });
        }

        // カテゴリフィルターボタン
        const categoryFilters = document.querySelectorAll('#categoryFilters .filter-btn');
        categoryFilters.forEach(btn => {
            btn.addEventListener('click', (e) => {
                categoryFilters.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.activeCategory = e.target.dataset.category;
                this.renderReference();
            });
        });

        // 危険度フィルターボタン
        const dangerFilters = document.querySelectorAll('#dangerFilters .filter-btn');
        dangerFilters.forEach(btn => {
            btn.addEventListener('click', (e) => {
                dangerFilters.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.activeDanger = e.target.dataset.danger;
                this.renderReference();
            });
        });

        // 逆引きリファレンス検索
        const reverseLookupSearch = document.getElementById('reverseLookupSearch');
        if (reverseLookupSearch) {
            reverseLookupSearch.addEventListener('input', (e) => {
                this.reverseLookupSearchQuery = e.target.value;
                this.renderReverseLookup();
            });
        }

        // 逆引きカテゴリフィルター
        const reverseCategoryFilters = document.querySelectorAll('#reverseCategoryFilters .filter-btn');
        reverseCategoryFilters.forEach(btn => {
            btn.addEventListener('click', (e) => {
                reverseCategoryFilters.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.activeReverseCategory = e.target.dataset.reverseCategory;
                this.renderReverseLookup();
            });
        });

        // スクロール時の関連項目表示
        this.setupScrollRelatedItems();
    }

    /**
     * リファレンスをレンダリング
     */
    renderReference() {
        const referenceContent = document.getElementById('referenceContent');
        let html = '';
        let count = 0;

        // Git コマンド
        Object.entries(CommandDatabase.git).forEach(([cmd, info]) => {
            // 検索クエリフィルター
            if (this.currentSearchQuery &&
                !cmd.includes(this.currentSearchQuery.toLowerCase()) &&
                !info.description.toLowerCase().includes(this.currentSearchQuery.toLowerCase())) {
                return;
            }

            // カテゴリフィルター
            if (this.activeCategory !== 'all' && info.category !== this.activeCategory) {
                return;
            }

            // 危険度フィルター
            if (this.activeDanger !== 'all' && info.dangerLevel !== this.activeDanger) {
                return;
            }

            const category = CommandDatabase.categories[info.category];
            html += `
                <div class="reference-card" data-command="git ${cmd}" data-category="${info.category}" data-danger="${info.dangerLevel}">
                    <h4>${category ? category.icon : ''} git ${cmd}</h4>
                    <p>${info.description}</p>
                    ${info.explanation ? `<p class="command-explanation">${this.escapeHtml(info.explanation)}</p>` : ''}
                    <p><strong>危険度:</strong> ${CommandDatabase.dangerLevels[info.dangerLevel].icon} ${CommandDatabase.dangerLevels[info.dangerLevel].label}</p>
                    ${info.prerequisites ? `<div class="task-prerequisites">${this.escapeHtml(info.prerequisites)}</div>` : ''}
                    ${info.examples ? `<p><strong>例:</strong> <code>${info.examples[0]}</code></p>` : ''}
                    ${info.nextSteps ? `<div class="task-next-steps">${this.escapeHtml(info.nextSteps)}</div>` : ''}
                    ${info.relatedCommands && info.relatedCommands.length > 0 ? this.renderRelatedCommands(info.relatedCommands, 'git') : ''}
                </div>
            `;
            count++;
        });

        // GitHub CLI コマンド
        Object.entries(CommandDatabase.gh).forEach(([cmd, info]) => {
            // 検索クエリフィルター
            if (this.currentSearchQuery &&
                !cmd.includes(this.currentSearchQuery.toLowerCase()) &&
                !info.description.toLowerCase().includes(this.currentSearchQuery.toLowerCase())) {
                return;
            }

            // カテゴリフィルター（GitHub CLIはgithubカテゴリとして扱う）
            if (this.activeCategory !== 'all' && this.activeCategory !== 'github') {
                return;
            }

            // 危険度フィルター
            if (this.activeDanger !== 'all' && info.dangerLevel !== this.activeDanger) {
                return;
            }

            html += `
                <div class="reference-card" data-command="gh ${cmd}" data-category="github" data-danger="${info.dangerLevel}">
                    <h4>🐙 gh ${cmd}</h4>
                    <p>${info.description}</p>
                    ${info.explanation ? `<p class="command-explanation">${this.escapeHtml(info.explanation)}</p>` : ''}
                    <p><strong>危険度:</strong> ${CommandDatabase.dangerLevels[info.dangerLevel].icon} ${CommandDatabase.dangerLevels[info.dangerLevel].label}</p>
                    ${info.prerequisites ? `<div class="task-prerequisites">${this.escapeHtml(info.prerequisites)}</div>` : ''}
                    ${info.examples ? `<p><strong>例:</strong> <code>${info.examples[0]}</code></p>` : ''}
                    ${info.nextSteps ? `<div class="task-next-steps">${this.escapeHtml(info.nextSteps)}</div>` : ''}
                    ${info.relatedCommands && info.relatedCommands.length > 0 ? this.renderRelatedCommands(info.relatedCommands, 'git') : ''}
                </div>
            `;
            count++;
        });

        referenceContent.innerHTML = html || '<p>該当するコマンドが見つかりませんでした。</p>';

        // 関連コマンドリンクのイベントリスナーを設定
        referenceContent.querySelectorAll('.related-link-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetCmd = e.target.dataset.commandName;
                const targetCard = referenceContent.querySelector(`[data-command="${targetCmd}"]`);
                if (targetCard) {
                    // スムーズにスクロール
                    targetCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // 一時的にハイライト
                    targetCard.classList.add('highlight-flash');
                    setTimeout(() => {
                        targetCard.classList.remove('highlight-flash');
                    }, 2000);
                }
            });
        });
    }

    /**
     * 関連コマンドをレンダリング
     */
    renderRelatedCommands(relatedCmds, prefix = 'git') {
        let html = '<div class="task-related">';
        html += '<h4>🔗 関連コマンド</h4>';
        html += '<div class="related-links">';

        relatedCmds.forEach(cmdName => {
            const fullCmdName = `${prefix} ${cmdName}`;
            html += `<button class="related-link-btn" data-command-name="${fullCmdName}">${cmdName}</button>`;
        });

        html += '</div></div>';
        return html;
    }

    /**
     * 逆引きリファレンスをレンダリング
     */
    renderReverseLookup() {
        const content = document.getElementById('reverseLookupContent');
        if (!content) return;

        const tasks = ReverseLookupDatabase.tasks;
        let html = '';

        tasks.forEach(task => {
            // カテゴリフィルター
            if (this.activeReverseCategory !== 'all' && task.category !== this.activeReverseCategory) {
                return;
            }

            // 検索クエリフィルター
            if (this.reverseLookupSearchQuery) {
                const query = this.reverseLookupSearchQuery.toLowerCase();
                const matchTask = task.task.toLowerCase().includes(query);
                const matchKeywords = task.keywords.some(kw => kw.toLowerCase().includes(query));
                if (!matchTask && !matchKeywords) {
                    return;
                }
            }

            const category = ReverseLookupDatabase.categories[task.category];

            html += `
                <div class="reverse-task-card" data-task-id="${task.id}">
                    <h3>
                        ${category.icon}
                        ${this.escapeHtml(task.task)}
                    </h3>
                    <span class="task-category">${category.name}</span>
            `;

            // 前提条件の表示
            if (task.prerequisites) {
                html += `<div class="task-prerequisites">${this.escapeHtml(task.prerequisites)}</div>`;
            }

            task.solutions.forEach(solution => {
                html += `
                    <div class="reverse-solution">
                        <h4>
                            ${this.escapeHtml(solution.title)}
                            ${solution.dangerLevel ? `<span class="danger-badge danger-${solution.dangerLevel}">${this.getDangerLabel(solution.dangerLevel)}</span>` : ''}
                        </h4>
                `;

                if (solution.when) {
                    html += `<p class="when-to-use">📌 ${this.escapeHtml(solution.when)}</p>`;
                }

                solution.commands.forEach(cmd => {
                    html += `
                        <div class="command-item">
                            <code>${this.escapeHtml(cmd.cmd)}</code>
                            <div class="desc">${this.escapeHtml(cmd.desc)}</div>
                        </div>
                    `;
                });

                if (solution.warning) {
                    html += `<div class="warning-message">${solution.warning}</div>`;
                }

                html += '</div>'; // reverse-solution
            });

            // 次のステップの表示
            if (task.nextSteps) {
                html += `<div class="task-next-steps">${this.escapeHtml(task.nextSteps)}</div>`;
            }

            // 関連タスクの表示
            if (task.relatedTasks && task.relatedTasks.length > 0) {
                html += '<div class="task-related">';
                html += '<h4>🔗 関連情報</h4>';
                html += '<div class="related-links">';

                task.relatedTasks.forEach(relatedId => {
                    const relatedTask = tasks.find(t => t.id === relatedId);
                    if (relatedTask) {
                        html += `<button class="related-link-btn" data-task-id="${relatedId}">${relatedTask.task}</button>`;
                    }
                });

                html += '</div></div>';
            }

            html += '</div>'; // reverse-task-card
        });

        content.innerHTML = html || '<p>該当する情報が見つかりませんでした。</p>';

        // 関連リンクのイベントリスナーを設定
        content.querySelectorAll('.related-link-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetId = e.target.dataset.taskId;
                const targetCard = content.querySelector(`[data-task-id="${targetId}"]`);
                if (targetCard) {
                    // スムーズにスクロール
                    targetCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // 一時的にハイライト
                    targetCard.classList.add('highlight-flash');
                    setTimeout(() => {
                        targetCard.classList.remove('highlight-flash');
                    }, 2000);
                }
            });
        });
    }

    /**
     * 危険度のラベルを取得
     */
    getDangerLabel(level) {
        const labels = {
            'safe': '✅ 安全',
            'warning': '⚠️ 注意',
            'high': '🔴 危険',
            'critical': '⛔ 非常に危険'
        };
        return labels[level] || level;
    }

    /**
     * スクロール関連機能を設定
     */
    setupScrollRelatedItems() {
        const referenceTab = document.getElementById('reference');
        const relatedItemsContainer = document.createElement('div');
        relatedItemsContainer.id = 'relatedItems';
        relatedItemsContainer.className = 'related-items hidden';
        relatedItemsContainer.innerHTML = `
            <h3>📚 関連コマンド</h3>
            <div id="relatedItemsContent"></div>
        `;

        // リファレンスタブにコンテナを追加
        if (referenceTab) {
            referenceTab.appendChild(relatedItemsContainer);

            // スクロールイベントリスナー
            referenceTab.addEventListener('scroll', () => {
                const scrollTop = referenceTab.scrollTop;
                const scrollHeight = referenceTab.scrollHeight;
                const clientHeight = referenceTab.clientHeight;

                // 下から100pxの位置に到達したら関連項目を表示
                if (scrollTop + clientHeight >= scrollHeight - 100) {
                    this.showRelatedItems();
                } else if (scrollTop + clientHeight < scrollHeight - 200) {
                    this.hideRelatedItems();
                }

                // トップへ戻るボタンの表示制御
                this.updateScrollToTopButton(scrollTop);
            });
        }
    }

    /**
     * 関連項目を表示
     */
    showRelatedItems() {
        const relatedItems = document.getElementById('relatedItems');
        if (!relatedItems || !relatedItems.classList.contains('hidden')) return;

        relatedItems.classList.remove('hidden');

        // 現在のフィルター設定に基づいて関連コマンドを提案
        const relatedContent = document.getElementById('relatedItemsContent');
        let html = '';

        // 現在のカテゴリに基づいた関連コマンドを表示
        const relatedSuggestions = this.getRelatedCommands();

        if (relatedSuggestions.length > 0) {
            relatedSuggestions.forEach(suggestion => {
                html += `
                    <div class="related-card" data-category="${suggestion.category}">
                        <h5>${suggestion.icon} ${suggestion.title}</h5>
                        <p>${suggestion.description}</p>
                        <button class="btn-link" data-filter-category="${suggestion.filterCategory}">
                            ${suggestion.title}のコマンドを見る →
                        </button>
                    </div>
                `;
            });
        } else {
            html = '<p>他のカテゴリも探索してみましょう！</p>';
        }

        relatedContent.innerHTML = html;

        // 関連カードのボタンにイベントリスナーを追加
        document.querySelectorAll('.related-card .btn-link').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.dataset.filterCategory;
                this.activeCategory = category;
                this.renderReference();

                // カテゴリフィルターボタンのUIを更新
                document.querySelectorAll('#categoryFilters .filter-btn').forEach(b => {
                    b.classList.remove('active');
                    if (b.dataset.category === category) {
                        b.classList.add('active');
                    }
                });

                // トップへスクロール
                const referenceTab = document.getElementById('reference');
                if (referenceTab) {
                    referenceTab.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        });
    }

    /**
     * 関連項目を非表示
     */
    hideRelatedItems() {
        const relatedItems = document.getElementById('relatedItems');
        if (relatedItems) {
            relatedItems.classList.add('hidden');
        }
    }

    /**
     * 関連コマンドを取得
     */
    getRelatedCommands() {
        const suggestions = [];

        // 現在のフィルター状態に基づいて関連項目を提案
        if (this.activeCategory === 'all') {
            suggestions.push(
                { icon: '🔍', title: '情報確認', description: 'リポジトリの状態を確認するコマンド', filterCategory: 'info', category: 'info' },
                { icon: '📝', title: 'ステージング', description: '変更をステージングエリアに追加', filterCategory: 'staging', category: 'staging' },
                { icon: '🌿', title: 'ブランチ操作', description: 'ブランチの作成・切り替え・削除', filterCategory: 'branch', category: 'branch' }
            );
        } else if (this.activeCategory === 'info') {
            suggestions.push(
                { icon: '📝', title: 'ステージング', description: '情報確認の後は変更をステージング', filterCategory: 'staging', category: 'staging' },
                { icon: '🔄', title: '同期', description: 'リモートとの同期を確認', filterCategory: 'remote', category: 'remote' }
            );
        } else if (this.activeCategory === 'staging') {
            suggestions.push(
                { icon: '💾', title: 'コミット', description: 'ステージした変更を記録', filterCategory: 'commit', category: 'commit' },
                { icon: '🔍', title: '情報確認', description: 'ステージの状態を確認', filterCategory: 'info', category: 'info' }
            );
        } else if (this.activeCategory === 'commit') {
            suggestions.push(
                { icon: '📤', title: 'プッシュ', description: 'コミットをリモートへ送信', filterCategory: 'remote', category: 'remote' },
                { icon: '🔙', title: '取り消し', description: 'コミットを取り消す方法', filterCategory: 'undo', category: 'undo' }
            );
        } else if (this.activeCategory === 'branch') {
            suggestions.push(
                { icon: '🔀', title: 'マージ', description: 'ブランチを統合する', filterCategory: 'merge', category: 'merge' },
                { icon: '💾', title: 'コミット', description: 'ブランチでの変更を記録', filterCategory: 'commit', category: 'commit' }
            );
        } else if (this.activeCategory === 'remote') {
            suggestions.push(
                { icon: '🌿', title: 'ブランチ操作', description: 'リモートブランチとの連携', filterCategory: 'branch', category: 'branch' },
                { icon: '🔀', title: 'マージ', description: 'リモートの変更をマージ', filterCategory: 'merge', category: 'merge' }
            );
        } else if (this.activeCategory === 'merge') {
            suggestions.push(
                { icon: '🔙', title: '取り消し', description: 'マージの問題を解決', filterCategory: 'undo', category: 'undo' },
                { icon: '🌿', title: 'ブランチ操作', description: 'マージ後のブランチ管理', filterCategory: 'branch', category: 'branch' }
            );
        }

        // 危険度フィルターに基づいた提案
        if (this.activeDanger === 'critical' || this.activeDanger === 'high') {
            suggestions.unshift(
                { icon: '✅', title: '安全なコマンド', description: '安全に使えるコマンドを確認', filterCategory: 'all', category: 'all' }
            );
        }

        return suggestions.slice(0, 3); // 最大3つまで表示
    }

    /**
     * トップへ戻るボタンの表示を更新
     */
    updateScrollToTopButton(scrollTop) {
        const scrollToTopBtn = document.getElementById('scrollToTopBtn');
        if (!scrollToTopBtn) return;

        if (scrollTop > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    }

    /**
     * テーマを切り替え
     */
    toggleTheme() {
        const body = document.body;
        const isDark = body.classList.toggle('dark-theme');
        const themeToggle = document.getElementById('themeToggle');

        if (themeToggle) {
            themeToggle.textContent = isDark ? '☀️' : '🌙';
        }

        this.settings.theme = isDark ? 'dark' : 'light';
        this.saveSettings();
    }

    /**
     * 言語を変更
     */
    changeLanguage(lang) {
        this.settings.language = lang;
        this.saveSettings();
        // 実際の言語変更処理は将来実装
        console.log(`Language changed to: ${lang}`);
    }

    /**
     * 設定を読み込み
     */
    loadSettings() {
        const defaultSettings = {
            theme: 'light',
            language: 'ja'
        };

        try {
            const saved = localStorage.getItem('gitWizardSettings');
            return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
        } catch (e) {
            return defaultSettings;
        }
    }

    /**
     * 設定を保存
     */
    saveSettings() {
        try {
            localStorage.setItem('gitWizardSettings', JSON.stringify(this.settings));
        } catch (e) {
            console.error('Failed to save settings:', e);
        }
    }

    /**
     * 設定を適用
     */
    applySettings() {
        if (this.settings.theme === 'dark') {
            document.body.classList.add('dark-theme');
            const themeToggle = document.getElementById('themeToggle');
            if (themeToggle) {
                themeToggle.textContent = '☀️';
            }
        }

        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.value = this.settings.language;
        }
    }

    /**
     * HTMLエスケープ
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * ウィザードを設定
     */
    setupWizard() {
        const wizardCards = document.querySelectorAll('.wizard-card');
        wizardCards.forEach(card => {
            card.addEventListener('click', () => {
                const wizardId = card.dataset.wizard;
                this.startWizard(wizardId);
            });
        });
    }

    /**
     * ウィザードを開始
     */
    startWizard(wizardId) {
        if (!WizardData[wizardId]) {
            console.error(`Wizard not found: ${wizardId}`);
            return;
        }

        this.currentWizard = WizardData[wizardId];
        this.currentStep = 0;
        this.renderWizard();
    }

    /**
     * ウィザードをレンダリング
     */
    renderWizard() {
        const wizardContent = document.getElementById('wizardContent');
        const wizardSelector = document.querySelector('.wizard-selector');

        if (!this.currentWizard) {
            wizardContent.classList.add('hidden');
            wizardSelector.classList.remove('hidden');
            return;
        }

        wizardSelector.classList.add('hidden');
        wizardContent.classList.remove('hidden');

        const step = this.currentWizard.steps[this.currentStep];
        const totalSteps = this.currentWizard.steps.length;

        let html = `
            <div class="wizard-header">
                <button class="btn btn-secondary" id="backToWizardsBtn">
                    ← コース一覧に戻る
                </button>
                <h2>${this.currentWizard.title}</h2>
                <div class="wizard-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${((this.currentStep + 1) / totalSteps) * 100}%"></div>
                    </div>
                    <div class="progress-text">ステップ ${this.currentStep + 1} / ${totalSteps}</div>
                </div>
            </div>

            <div class="wizard-step">
                <h3>${step.title}</h3>
                <div class="wizard-step-content">
                    ${step.content || ''}
                </div>
        `;

        // ステップタイプに応じたコンテンツ
        if (step.commands && step.commands.length > 0) {
            html += '<div class="wizard-commands">';
            step.commands.forEach(cmd => {
                const highlightClass = cmd.highlight ? 'highlight' : '';
                html += `
                    <div class="wizard-command ${highlightClass}">
                        <code>${this.escapeHtml(cmd.command)}</code>
                        <p>${cmd.explanation}</p>
                    </div>
                `;
            });
            html += '</div>';
        }

        // 選択肢がある場合
        if (step.choices && step.choices.length > 0) {
            html += '<div class="wizard-choices">';
            step.choices.forEach(choice => {
                html += `
                    <div class="wizard-choice">
                        <h4>${choice.icon || ''} ${choice.title}</h4>
                        ${choice.content || ''}
                        ${choice.commands ? this.renderWizardCommands(choice.commands) : ''}
                    </div>
                `;
            });
            html += '</div>';
        }

        // ダイアグラム
        if (step.diagram) {
            html += `<div class="wizard-diagram">${step.diagram}</div>`;
        }

        // ノート
        if (step.note) {
            html += `<div class="wizard-note">💡 ${step.note}</div>`;
        }

        // ヒント
        if (step.tip) {
            html += `<div class="wizard-tip">${step.tip}</div>`;
        }

        // 警告
        if (step.warning) {
            html += `<div class="wizard-warning">${step.warning}</div>`;
        }

        // 検証方法
        if (step.verification) {
            html += `<div class="wizard-verification">${step.verification}</div>`;
        }

        // 期待される出力
        if (step.expectedOutput) {
            html += `
                <div class="wizard-expected">
                    <h4>期待される出力:</h4>
                    <pre>${this.escapeHtml(step.expectedOutput)}</pre>
                </div>
            `;
        }

        // 代替案
        if (step.alternative) {
            html += `<div class="wizard-alternative">${step.alternative}</div>`;
        }

        // ナビゲーションボタン
        html += '<div class="wizard-navigation">';

        if (this.currentStep > 0) {
            html += '<button class="btn btn-secondary" id="prevStepBtn">← 前のステップ</button>';
        }

        if (this.currentStep < totalSteps - 1) {
            html += '<button class="btn btn-primary" id="nextStepBtn">次のステップ →</button>';
        } else {
            html += '<button class="btn btn-primary" id="finishWizardBtn">完了！ 🎉</button>';
        }

        html += '</div>';
        html += '</div>'; // wizard-step

        wizardContent.innerHTML = html;

        // イベントリスナーを設定
        this.setupWizardEventListeners();
    }

    /**
     * ウィザードコマンドをレンダリング
     */
    renderWizardCommands(commands) {
        let html = '<div class="wizard-commands">';
        commands.forEach(cmd => {
            const highlightClass = cmd.highlight ? 'highlight' : '';
            html += `
                <div class="wizard-command ${highlightClass}">
                    <code>${this.escapeHtml(cmd.command)}</code>
                    <p>${cmd.explanation}</p>
                </div>
            `;
        });
        html += '</div>';
        return html;
    }

    /**
     * ウィザードイベントリスナーを設定
     */
    setupWizardEventListeners() {
        const backBtn = document.getElementById('backToWizardsBtn');
        const nextBtn = document.getElementById('nextStepBtn');
        const prevBtn = document.getElementById('prevStepBtn');
        const finishBtn = document.getElementById('finishWizardBtn');

        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.currentWizard = null;
                this.currentStep = 0;
                this.renderWizard();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.currentStep++;
                this.renderWizard();
                document.getElementById('wizardContent').scrollIntoView({ behavior: 'smooth' });
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.currentStep--;
                this.renderWizard();
                document.getElementById('wizardContent').scrollIntoView({ behavior: 'smooth' });
            });
        }

        if (finishBtn) {
            finishBtn.addEventListener('click', () => {
                this.showWizardCompletion();
            });
        }
    }

    /**
     * ウィザード完了画面を表示
     */
    showWizardCompletion() {
        const wizardContent = document.getElementById('wizardContent');

        const html = `
            <div class="wizard-completion">
                <div class="completion-icon">🎉</div>
                <h2>おめでとうございます！</h2>
                <p>${this.currentWizard.title} コースを完了しました。</p>

                <div class="completion-actions">
                    <button class="btn btn-primary" id="anotherWizardBtn">
                        別のコースを学ぶ
                    </button>
                    <button class="btn btn-secondary" id="tryCommandsBtn">
                        コマンドを試す
                    </button>
                </div>
            </div>
        `;

        wizardContent.innerHTML = html;

        document.getElementById('anotherWizardBtn').addEventListener('click', () => {
            this.currentWizard = null;
            this.currentStep = 0;
            this.renderWizard();
        });

        document.getElementById('tryCommandsBtn').addEventListener('click', () => {
            this.switchTab('analyzer');
        });
    }
}

// アプリケーション起動
document.addEventListener('DOMContentLoaded', () => {
    window.gitWizardApp = new GitWizardApp();
});
