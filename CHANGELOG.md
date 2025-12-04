# Changelog

All notable changes to DEXAI.ro will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-12-03

### 🎉 Initial Release

DEXAI.ro - The first AI-powered collaborative Romanian dictionary is now live!

### ✨ Features

#### Core Functionality
- **Intelligent Word Search**: Search for any Romanian word with AI-powered analysis
- **Automatic Word Generation**: GPT-4o generates comprehensive word information if not in database
- **Lemmatization**: Automatically identifies base form (infinitive/singular) regardless of conjugation
- **Anonymous Discoveries**: Users can add words without authentication, with encouragement to sign up

#### AI-Powered Analysis
- **Comprehensive Content**: 12-15 usage examples, 10-15 synonyms, 12-15 collocations, 8-10 usage notes
- **Detailed Definitions**: 4-8 definitions with short and long explanations
- **Etymology & Pronunciation**: Complete linguistic information
- **Conjugations & Declensions**: Full verb conjugations and noun declensions
- **Frequency & Difficulty Levels**: CEFR-aligned difficulty ratings

#### Gamification & Community
- **Points System**: Earn points for discovering new words (1 point per discovery)
- **Real-time Leaderboard**: Live rankings of top contributors
- **User Profiles**: Track contributions, points, and discovery history
- **Daily Limits**: Anti-spam protection (50 discoveries per day, 5 per minute)

#### Community Voting System
- **Four Vote Types**: Like 👍, Dislike 👎, Validate ✓, Report Error ⚠️
- **Community Verification**: Words automatically verified after 5+ validations (with <3 errors)
- **Real-time Vote Counts**: Live display of vote statistics
- **One Vote Per User**: Mutually exclusive voting to prevent manipulation

#### Real-time Features
- **Live Statistics**: Real-time word count, user count, and daily discoveries
- **Recent Discoveries Feed**: See latest words added with live updates
- **Snapshot Listeners**: Firestore real-time updates across the platform

#### User Experience
- **Google Authentication**: Quick and secure login
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Diacritics Support**: Proper handling of Romanian special characters (ă, â, î, ș, ț)
- **Search Without Diacritics**: Find words even without typing diacritics
- **Anonymous Contributions**: Add words without account, encouraged to sign up

#### Developer Tools
- **Regenerate Button**: Development-only feature to update words with current AI prompts
- **Comprehensive Logging**: Track word discoveries, searches, and contributions
- **Version Tracking**: Monitor AI version and regeneration count

### 🔒 Security

#### Rate Limiting
- **IP-Based Throttling**: Anonymous users limited to 10 requests per hour
- **Endpoint Rate Limits**: 
  - Flag API: 5 reports per hour per user
  - Vote API: 20 votes per minute per user
- **User Rate Limits**: 50 word discoveries per day, 5 per minute

#### Input Sanitization
- **XSS Prevention**: All user inputs sanitized (removes HTML/scripts)
- **Word Validation**: Romanian characters only, proper length limits
- **Text Sanitization**: Flag reasons and descriptions cleaned

#### Authentication & Authorization
- **Firebase Auth Integration**: Secure Google authentication
- **Token Validation**: Bearer tokens verified on all protected endpoints
- **Admin SDK Protection**: Privileged operations use Firebase Admin SDK

#### Firestore Security
- **Comprehensive Rules**: All collections protected with proper access controls
- **Vote Collection Rules**: Enforce vote types and user ownership
- **Anonymous Search Logs**: Allow unauthenticated users to create logs
- **User Data Protection**: Users can only modify their own data

### 🛠️ Technical Implementation

#### Frontend
- **Next.js 16**: App Router with React 19
- **TypeScript**: Full type safety
- **Tailwind CSS**: Utility-first styling
- **Real-time Updates**: Firestore snapshot listeners
- **Client Components**: Optimized for interactivity

#### Backend
- **Firebase Firestore**: NoSQL database
- **Firebase Admin SDK**: Server-side operations
- **Azure OpenAI**: GPT-4o for word analysis (16,000 max tokens)
- **API Routes**: RESTful endpoints for all operations

#### Infrastructure
- **Environment Variables**: Proper separation of public/private configs
- **Error Handling**: Comprehensive error messages and logging
- **Performance**: Optimized queries and caching strategies

### 📚 Documentation
- **README.md**: Comprehensive setup and usage guide
- **SECURITY_AUDIT.md**: Complete security audit report (8.5/10 score)
- **Environment Setup**: Detailed configuration instructions
- **API Documentation**: Inline code documentation

### 🐛 Bug Fixes
- Fixed Firestore Timestamp serialization for client components
- Fixed missing diacritics on word regeneration
- Fixed undefined `createdByUserId` for anonymous users
- Fixed vote counter field names (errorsCount vs report_errorsCount)

### 🔄 Known Issues
- Vote manipulation possible with fake accounts (mitigation: rate limits + error threshold)
- No email verification requirement yet
- Production deployment not yet configured

### 📋 Technical Debt
- TODO: Implement CAPTCHA for anonymous users
- TODO: Add email verification
- TODO: Increase verification threshold to 10+ votes
- TODO: Implement "trusted user" concept
- TODO: Add Content Security Policy headers

---

## [0.2.0] - 2025-12-04

### ✨ Features

#### Git Workflow Automation
- **Husky Git Hooks**: Automated quality checks before commits and pushes
  - Pre-commit: Type checking on staged files
  - Commit-msg: Conventional Commits format validation
  - Pre-push: Full type check and build verification
- **Commitlint**: Enforces 9 commit types (feat, fix, docs, style, refactor, test, chore, perf, ci)
- **Lint-staged**: Runs type checking only on staged TypeScript files
- **Standard-version**: Automated changelog generation and semantic versioning
- **Release Scripts**: `npm run release` for automated version bumps

#### Firebase Analytics Integration
- **Comprehensive Event Tracking**: 15+ custom analytics events
- **Automatic Page View Tracking**: AnalyticsProvider with route change detection
- **User Authentication Tracking**:
  - Login/signup events with authentication method
  - User ID and properties (totalPoints, wordsDiscovered) set on auth
- **Search Analytics**:
  - Word search tracking with result counts
  - Word discovery events with new/existing flags
- **Engagement Tracking**:
  - Vote casting (like, dislike, validate, report_error)
  - Content flagging with reason categories
  - Profile views with ownership detection
  - Leaderboard views
- **Performance Monitoring**: Custom dimensions for user behavior analysis

#### SEO Optimization
- **robots.txt**: Dynamic search engine crawling rules
  - Allows all crawlers except /api/ and /_next/ routes
  - References sitemap.xml for comprehensive indexing
- **Dynamic Sitemap**: Automatic sitemap generation
  - Fetches up to 10,000 words from Firestore
  - Includes all word pages with priorities and change frequencies
  - Static pages (homepage, leaderboard) with appropriate metadata
- **JSON-LD Structured Data**: Rich search results support
  - DefinedTerm schema for dictionary entries
  - Article schema with publish/modified dates
  - BreadcrumbList for navigation
  - Organization schema for site information
  - WebSite schema with SearchAction
- **Enhanced Metadata**:
  - Comprehensive Open Graph tags for social sharing
  - Twitter Card optimization with large image format
  - Canonical URLs to prevent duplicate content
  - Dynamic keyword generation from word data
  - SEO-optimized meta descriptions (~150 chars)
  - Article timestamps for content freshness
- **SEO Utilities**: Helper functions for metadata generation
  - `generateWordMetaDescription`: Creates optimized descriptions
  - `generateWordKeywords`: Extracts relevant keywords
  - `generateCanonicalUrl`: Canonical URL generation
  - `extractMainDefinition`: Definition truncation for previews

### 🐛 Bug Fixes

#### Timestamp Handling (Critical Production Fix)
- **Fixed "Invalid time value" Error**: Prevented RangeError crashes on word pages
- **SerializedTimestamp Type**: Added type definition for client-side timestamps
- **Safe Conversion Helpers**:
  - `toISOStringSafe()`: Safely converts timestamps to ISO strings
  - `toDateSafe()`: Safely converts timestamps to Date objects
  - Handles both Firestore Timestamp and SerializedTimestamp formats
  - Validates timestamps before conversion to prevent NaN
  - Graceful fallback for missing/invalid timestamps
- **Updated Components**:
  - Fixed StructuredData component date handling
  - Fixed metadata generation in word pages
  - Fixed RecentDiscoveries component time display
- **Type Safety**: Updated Word interface to accept both timestamp types

### 📚 Documentation
- **SEO Implementation Guide**: Comprehensive SEO_IMPLEMENTATION.md
  - Complete file descriptions and implementation details
  - Validation checklist and testing procedures
  - Expected SEO impact metrics (+40-60% visibility)
  - Future enhancement roadmap
  - Maintenance schedule

### 🔧 Technical Improvements
- **Type Safety**: Enhanced TypeScript definitions for timestamps
- **Error Handling**: Robust timestamp validation and error prevention
- **Code Quality**: Automated checks enforce quality standards
- **Version Control**: Conventional commits enable automated changelogs
- **Build Verification**: Pre-push hooks prevent broken code deployment

### 📊 Expected Impact
- **SEO Performance**:
  - Search visibility: +40-60% within 3 months
  - Click-through rate: +15-25% improvement
  - Social shares: +30-50% with optimized cards
  - Organic traffic: +50-80% within 6 months
- **Code Quality**:
  - Zero broken commits with pre-commit hooks
  - 100% adherence to Conventional Commits format
  - Automated quality gates prevent regressions
- **Analytics Insights**:
  - Complete user behavior tracking
  - Data-driven optimization opportunities
  - Performance monitoring and analysis

---

## [Unreleased]

### Planned Features
- Email verification for new users
- CAPTCHA for anonymous word additions
- Admin dashboard for content moderation
- Word editing and enhancement by community
- Enhanced examples with sources
- Audio pronunciations
- Word relationships visualization
- Advanced search filters
- Export functionality
- API access for developers

---

[0.2.0]: https://github.com/dragoscatalin/dexai/releases/tag/v0.2.0
[0.1.0]: https://github.com/dragoscatalin/dexai/releases/tag/v0.1.0
