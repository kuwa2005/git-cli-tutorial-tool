/**
 * Command Analyzer
 * コマンドを解析し、危険性の判定や警告の生成を行う
 */

class CommandAnalyzer {
    constructor(database) {
        this.db = database;
    }

    /**
     * コマンド文字列を解析
     * @param {string} commandString - 解析するコマンド文字列
     * @returns {object} 解析結果
     */
    analyze(commandString) {
        const trimmed = commandString.trim();

        if (!trimmed) {
            return {
                error: 'コマンドを入力してください'
            };
        }

        // コマンドをパース
        const parts = this.parseCommand(trimmed);

        if (!parts) {
            return {
                error: '不正なコマンド形式です'
            };
        }

        // コマンドの詳細情報を取得
        const commandInfo = this.getCommandInfo(parts);

        if (!commandInfo) {
            return {
                error: `未知のコマンド: ${parts.command}`,
                suggestion: 'git または gh で始まるコマンドを入力してください'
            };
        }

        // 危険度を判定
        const dangerLevel = this.assessDanger(parts, commandInfo);

        // 警告を生成
        const warnings = this.generateWarnings(parts, commandInfo);

        // 説明を生成
        const explanation = this.generateExplanation(parts, commandInfo);

        // 代替案を生成
        const alternatives = this.generateAlternatives(parts, commandInfo, warnings);

        // 元に戻す方法を生成
        const undoMethod = this.generateUndoMethod(parts, commandInfo);

        return {
            success: true,
            command: parts,
            commandInfo,
            dangerLevel,
            warnings,
            explanation,
            alternatives,
            undoMethod
        };
    }

    /**
     * コマンド文字列をパース
     */
    parseCommand(commandString) {
        const tokens = commandString.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g);

        if (!tokens || tokens.length === 0) {
            return null;
        }

        const tool = tokens[0]; // git or gh
        const command = tokens[1]; // push, commit, pr, etc.
        const subcommand = tokens[2]; // create, list, etc. (for gh)
        const args = tokens.slice(tool === 'gh' && command ? 2 : 2);

        return {
            tool,
            command,
            subcommand: this.isGhCommand(tool, command) ? subcommand : null,
            args,
            options: this.extractOptions(args),
            fullCommand: commandString
        };
    }

    /**
     * GitHub CLI コマンドかチェック
     */
    isGhCommand(tool, command) {
        return tool === 'gh' && ['pr', 'issue', 'repo'].includes(command);
    }

    /**
     * オプションを抽出
     */
    extractOptions(args) {
        const options = [];
        for (let i = 0; i < args.length; i++) {
            if (args[i].startsWith('-')) {
                options.push({
                    flag: args[i],
                    value: args[i + 1] && !args[i + 1].startsWith('-') ? args[i + 1] : null
                });
            }
        }
        return options;
    }

    /**
     * コマンド情報を取得
     */
    getCommandInfo(parts) {
        if (parts.tool === 'git') {
            return this.db.git[parts.command];
        } else if (parts.tool === 'gh') {
            return this.db.gh[parts.command];
        }
        return null;
    }

    /**
     * 危険度を評価
     */
    assessDanger(parts, commandInfo) {
        let baseDanger = commandInfo.dangerLevel;
        let level = baseDanger;

        // オプションによって危険度が上がる場合
        if (parts.command === 'push') {
            const hasForce = parts.args.some(arg => arg === '-f' || arg === '--force');
            const hasUpstream = parts.args.includes('upstream');
            const hasMain = parts.args.includes('main') || parts.args.includes('master');

            if (hasForce) {
                level = 'critical';
            } else if (hasUpstream) {
                level = 'critical';
            } else if (hasMain) {
                level = 'warning';
            }
        }

        if (parts.command === 'reset' && parts.args.includes('--hard')) {
            level = 'critical';
        }

        if (parts.command === 'clean') {
            level = 'critical';
        }

        return {
            level,
            ...this.db.dangerLevels[level]
        };
    }

    /**
     * 警告を生成
     */
    generateWarnings(parts, commandInfo) {
        const warnings = [];

        // コマンド固有の警告
        if (commandInfo.warnings) {
            // デフォルト警告
            if (commandInfo.warnings.default) {
                warnings.push({
                    level: commandInfo.warnings.default.level,
                    message: commandInfo.warnings.default.message,
                    type: 'command-default'
                });
            }

            // 特定のオプションや引数に対する警告
            parts.args.forEach(arg => {
                if (commandInfo.warnings[arg]) {
                    warnings.push({
                        level: commandInfo.warnings[arg].level,
                        message: commandInfo.warnings[arg].message,
                        type: 'option-specific',
                        trigger: arg
                    });
                }
            });
        }

        // git push の特別チェック
        if (parts.command === 'push') {
            warnings.push(...this.checkPushWarnings(parts));
        }

        // git reset の特別チェック
        if (parts.command === 'reset' && parts.args.includes('--hard')) {
            warnings.push({
                level: 'critical',
                message: '⚠️ 警告: --hard オプションは作業ディレクトリのすべての変更を破棄します。元に戻すことはできません！',
                type: 'destructive-operation',
                recommendations: [
                    'git stash で変更を一時保存することを検討してください',
                    '本当に削除して良いか、もう一度確認してください'
                ]
            });
        }

        // git clean の特別チェック
        if (parts.command === 'clean') {
            const hasDryRun = parts.args.includes('-n') || parts.args.includes('--dry-run');
            if (!hasDryRun) {
                warnings.push({
                    level: 'critical',
                    message: '⚠️ 警告: git clean は追跡されていないファイルを完全に削除します！',
                    type: 'destructive-operation',
                    recommendations: [
                        'まず git clean -n で削除されるファイルを確認してください',
                        '重要なファイルが含まれていないか確認してください'
                    ]
                });
            }
        }

        return warnings;
    }

    /**
     * git push の警告をチェック
     */
    checkPushWarnings(parts) {
        const warnings = [];
        const args = parts.args;

        // upstream へのプッシュチェック
        const upstreamIndex = args.indexOf('upstream');
        if (upstreamIndex !== -1) {
            warnings.push({
                level: 'critical',
                message: '🚨 Fork元へのプッシュ検出！',
                type: 'fork-upstream-push',
                detail: 'upstream は通常、フォーク元のリポジトリを指します。フォーク元に直接プッシュすることは通常行いません。',
                recommendations: [
                    '自分のフォーク（origin）にプッシュしてください',
                    'その後、Pull Request を作成してフォーク元に変更を提案してください'
                ],
                correctCommands: [
                    `git push origin ${args[upstreamIndex + 1] || 'ブランチ名'}`,
                    'gh pr create --repo upstream/repo'
                ]
            });
        }

        // main/master への直接プッシュ
        const hasMain = args.includes('main') || args.includes('master');
        if (hasMain && upstreamIndex === -1) {
            const branchName = args.includes('main') ? 'main' : 'master';
            warnings.push({
                level: 'warning',
                message: `⚠️ ${branchName} ブランチへの直接プッシュ`,
                type: 'main-branch-push',
                detail: `${branchName} ブランチへの直接プッシュは、多くのプロジェクトで推奨されていません。`,
                recommendations: [
                    'フィーチャーブランチを作成して作業してください',
                    'Pull Request を通じて変更を取り込むことを検討してください'
                ],
                correctCommands: [
                    'git checkout -b feature/my-feature',
                    'git push origin feature/my-feature',
                    'gh pr create'
                ]
            });
        }

        // 強制プッシュ
        const hasForce = args.some(arg => arg === '-f' || arg === '--force');
        if (hasForce) {
            warnings.push({
                level: 'critical',
                message: '🚨 強制プッシュ（--force）を検出！',
                type: 'force-push',
                detail: '強制プッシュは、リモートの履歴を上書きします。他の人が同じブランチで作業している場合、その作業が失われる可能性があります。',
                recommendations: [
                    '他の人がこのブランチで作業していないか確認してください',
                    '可能であれば --force-with-lease を使用してください（より安全）',
                    '本当に強制プッシュが必要か再確認してください'
                ],
                correctCommands: [
                    args.map(arg => arg === '-f' ? '--force-with-lease' : arg === '--force' ? '--force-with-lease' : arg).join(' ')
                ]
            });
        }

        return warnings;
    }

    /**
     * コマンドの説明を生成
     */
    generateExplanation(parts, commandInfo) {
        const breakdown = [];

        // コマンド自体の説明
        breakdown.push({
            part: `${parts.tool} ${parts.command}`,
            description: commandInfo.description
        });

        // サブコマンド（gh の場合）
        if (parts.subcommand && commandInfo.subcommands) {
            breakdown.push({
                part: parts.subcommand,
                description: commandInfo.subcommands[parts.subcommand] || '不明なサブコマンド'
            });
        }

        // 引数とオプション
        parts.args.forEach(arg => {
            if (arg.startsWith('-')) {
                // オプション
                const optionDesc = commandInfo.options?.[arg];
                if (optionDesc) {
                    breakdown.push({
                        part: arg,
                        description: optionDesc
                    });
                }
            } else {
                // 引数（リモート名、ブランチ名など）
                breakdown.push({
                    part: arg,
                    description: this.describeArgument(parts.command, arg)
                });
            }
        });

        return {
            summary: commandInfo.explanation,
            breakdown,
            examples: commandInfo.examples
        };
    }

    /**
     * 引数の説明を生成
     */
    describeArgument(command, arg) {
        // リモート名の判定
        if (['origin', 'upstream'].includes(arg)) {
            if (arg === 'origin') {
                return '自分のリモートリポジトリ（通常は自分のフォーク）';
            } else if (arg === 'upstream') {
                return 'フォーク元のリモートリポジトリ';
            }
        }

        // ブランチ名の判定
        if (['main', 'master', 'develop'].includes(arg)) {
            return `${arg} ブランチ`;
        }

        // URL の判定
        if (arg.startsWith('http://') || arg.startsWith('https://') || arg.startsWith('git@')) {
            return 'リポジトリのURL';
        }

        return '引数';
    }

    /**
     * 代替案を生成
     */
    generateAlternatives(parts, commandInfo, warnings) {
        const alternatives = [];

        // 警告がある場合、より安全な代替案を提案
        warnings.forEach(warning => {
            if (warning.correctCommands) {
                warning.correctCommands.forEach(cmd => {
                    alternatives.push({
                        command: cmd,
                        reason: warning.message,
                        description: '上記の問題を回避する推奨コマンド'
                    });
                });
            }
        });

        // コマンド固有の代替案
        if (parts.command === 'checkout' && !parts.args.includes('--')) {
            alternatives.push({
                command: `git switch ${parts.args.join(' ')}`,
                reason: 'より新しく、安全なブランチ切り替えコマンド',
                description: 'git switch は git checkout のブランチ切り替え機能に特化したコマンドです'
            });
        }

        return alternatives.length > 0 ? alternatives : null;
    }

    /**
     * 元に戻す方法を生成
     */
    generateUndoMethod(parts, commandInfo) {
        const undoMethods = {
            'add': {
                command: 'git reset HEAD ファイル名',
                description: 'ステージングを取り消します（変更は保持されます）'
            },
            'commit': {
                command: 'git reset --soft HEAD~1',
                description: '直前のコミットを取り消します（変更はステージングエリアに残ります）'
            },
            'push': {
                command: 'git revert <commit-hash>',
                description: '既にプッシュしたコミットを安全に取り消すには revert を使用します',
                warning: 'プッシュ後の変更を取り消すには、新しいコミットで打ち消すのが安全です'
            },
            'merge': {
                command: 'git merge --abort',
                description: 'マージを中止します（マージ中の場合）'
            },
            'rebase': {
                command: 'git rebase --abort',
                description: 'リベースを中止します（リベース中の場合）'
            },
            'branch': {
                command: 'git branch ブランチ名 <commit-hash>',
                description: '削除したブランチを復元します（git reflog で commit-hash を確認）'
            }
        };

        return undoMethods[parts.command] || null;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CommandAnalyzer;
}
