# 宅建ドリル - Cloudflare Pages デプロイ手順

## プロジェクト概要
- 4択問題 62問 + OX一問一答 28問 + 暗記カード 14枚
- 弱点分析AI（間違えたテーマを重点出題）
- スペースドリピティション（復習アラート）
- 学習プランナー（残日数×時間配分）
- ダーク/ライトモード
- 専門用語インライン注釈（60語 - 初出時に自動で意味を表示）
- 頻出度 5段階表示
- localStorage でデータ永続化（正解率は週ごとに自動リセット、過去12週分アーカイブ）

## デプロイ方法

### 方法1: GitHub + Cloudflare Pages（推奨）

```bash
# 1. GitHubにリポジトリ作成
gh repo create takken-drill --public

# 2. ローカルで初期化・プッシュ
cd takken-drill
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/takken-drill.git
git push -u origin main

# 3. Cloudflare Pages で連携
# - Cloudflare Dashboard → Pages → Create a project
# - Connect to Git → GitHubリポジトリを選択
# - Build settings:
#   Framework preset: None
#   Build command: npm install && npm run build
#   Build output directory: dist
# - Save and Deploy
```

### 方法2: Manus AI 経由

Manusに以下を指示:
「このプロジェクトをGitHubリポジトリに作成し、Cloudflare Pagesにデプロイしてください。ビルドコマンドは `npm install && npm run build`、出力ディレクトリは `dist` です。」

### 方法3: Wrangler CLI

```bash
cd takken-drill
npm install
npm run build
npx wrangler pages deploy dist --project-name=takken-drill
```

## AI生成モードについて
- デプロイ後、AI生成モードを使うには Cloudflare Worker を Anthropic API のプロキシとして設定する必要があります
- プリセット＋弱点優先モードはAPIキー不要で動作します
- 90問のプリセットだけでも十分な学習効果があります

## カスタマイズ
- `src/App.jsx` の `PQ` オブジェクトに問題を追加可能
- `OX` オブジェクトにOX問題を追加可能
- `MNEMONICS` 配列に暗記カードを追加可能
- `GLOSSARY` オブジェクトに用語を追加可能
