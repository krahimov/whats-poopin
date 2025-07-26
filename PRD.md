# Product Requirements Document (PRD)
## Poop Health Analyzer AI - "What's Poopin'"

### Executive Summary
What's Poopin' is an AI-powered health analysis application that uses GPT-4 Vision to analyze fecal matter images and provide health insights. The application is initially tailored for animals (starting with dogs) and will expand to human health analysis. Similar to Cal AI but focused on digestive health indicators through stool analysis.

### Product Overview

#### Vision
To become the leading AI-powered digestive health monitoring tool that helps pet owners and individuals track and improve their health through non-invasive, instant analysis.

#### Mission
Democratize access to digestive health insights by providing instant, accurate, and actionable health recommendations based on visual analysis of stool samples.

### Target Users

#### Primary Users (MVP)
- **Pet Owners**: Dog owners concerned about their pet's digestive health
- Age: 25-55
- Tech-savvy individuals comfortable with mobile apps
- Health-conscious pet parents

#### Secondary Users (Future)
- Cat owners
- Human users seeking personal health insights
- Veterinarians (professional version)
- Pet care services

### Core Features

#### MVP Features (Phase 1)
1. **Image Upload & Analysis**
   - Upload images via camera or gallery
   - Support for multiple image formats (JPG, PNG, HEIF)
   - Real-time analysis using GPT-4 Vision API

2. **Health Scoring System**
   - 1-100 health score based on multiple factors
   - Visual indicators (color coding: red/yellow/green)
   - Breakdown of score components

3. **Analysis Components**
   - Color assessment
   - Consistency evaluation
   - Shape and size analysis
   - Abnormality detection
   - Parasite/foreign object detection

4. **Recommendations Engine**
   - Dietary suggestions
   - Hydration recommendations
   - Exercise advice
   - When to consult a veterinarian

5. **User Authentication**
   - Secure login via Clerk
   - User profiles
   - Pet profiles (multiple pets per user)

6. **History Tracking**
   - Save analysis results
   - Track health trends over time
   - Visual charts and graphs
   - Export capabilities

#### Phase 2 Features
1. **Multi-Species Support**
   - Cats
   - Horses
   - Other common pets

2. **Human Health Analysis**
   - Bristol Stool Chart integration
   - More detailed health indicators

3. **Sharing & Community**
   - Share results with veterinarians
   - Anonymous community comparisons
   - Health tips forum

4. **Premium Features**
   - Detailed PDF reports
   - Veterinary consultation booking
   - Advanced trend analysis
   - Custom alerts

### Technical Architecture

#### Frontend
- **Framework**: Next.js 15 with App Router
- **UI Components**: Custom components with Radix UI
- **Styling**: Tailwind CSS
- **State Management**: React hooks
- **Authentication**: Clerk

#### Backend
- **API Routes**: Next.js API routes
- **Image Processing**: Cloudinary for storage
- **AI Integration**: OpenAI GPT-4 Vision API
- **Database**: InstantDB for real-time data

#### Key Integrations
1. **OpenAI GPT-4 Vision**
   - Primary analysis engine
   - Custom prompts with health reference images
   - JSON response format

2. **Cloudinary**
   - Image upload and storage
   - Image optimization
   - CDN delivery

3. **Clerk**
   - User authentication
   - Session management
   - User profiles

### Analysis Algorithm

#### Input Processing
1. Image validation (quality, lighting, focus)
2. Image enhancement if needed
3. GPT-4 Vision analysis with custom prompt

#### Analysis Criteria
1. **Color** (30% weight)
   - Healthy brown vs concerning colors
   - Uniformity of color

2. **Consistency** (25% weight)
   - Bristol Stool Chart equivalent for animals
   - Texture analysis

3. **Shape & Size** (20% weight)
   - Appropriate for animal size
   - Regularity

4. **Abnormalities** (25% weight)
   - Blood detection
   - Mucus presence
   - Foreign objects
   - Parasites

#### System Prompt Structure
```
You are a veterinary health expert analyzing [animal type] stool samples.

Reference healthy samples: [embedded healthy reference images]
Reference unhealthy samples: [embedded unhealthy reference images]

Analyze for:
1. Color (healthy brown vs concerning colors)
2. Consistency (well-formed vs loose/hard)
3. Shape and size appropriateness
4. Visible abnormalities (blood, mucus, parasites, foreign objects)

Provide:
- Health score (1-100)
- Brief summary
- Top 3 recommendations
- Health concerns if any
- Dietary changes suggested
```

### User Experience Flow

1. **Onboarding**
   - Sign up/Login
   - Add pet profile
   - Tutorial on taking good photos

2. **Analysis Flow**
   - Select pet
   - Take/upload photo
   - View instant results
   - Save to history
   - Get recommendations

3. **History & Tracking**
   - View past analyses
   - See health trends
   - Set reminders

### Success Metrics

#### Key Performance Indicators (KPIs)
1. **User Engagement**
   - Daily active users
   - Analyses per user per week
   - User retention (30-day)

2. **Analysis Quality**
   - User satisfaction ratings
   - Veterinary validation accuracy
   - False positive/negative rates

3. **Business Metrics**
   - User acquisition cost
   - Premium conversion rate
   - Monthly recurring revenue

### Privacy & Security

1. **Data Protection**
   - End-to-end encryption for images
   - HIPAA-compliant infrastructure (future)
   - User data anonymization

2. **Privacy Features**
   - Private by default
   - Opt-in sharing only
   - Data deletion options

### Monetization Strategy

#### Freemium Model
- **Free Tier**: 5 analyses per month
- **Premium Tier** ($9.99/month):
  - Unlimited analyses
  - Advanced trends
  - PDF reports
  - Priority support

#### B2B Opportunities
- Veterinary clinic partnerships
- Pet insurance integrations
- Pet food brand partnerships

### Roadmap

#### Phase 1 (MVP) - Months 1-3
- Dog health analysis
- Core features implementation
- Beta testing with 100 users

#### Phase 2 - Months 4-6
- Cat support
- Premium features
- Mobile app development

#### Phase 3 - Months 7-9
- Human health analysis
- Veterinary partnerships
- API for third-party integration

#### Phase 4 - Months 10-12
- Multi-language support
- Advanced AI features
- International expansion

### Risks & Mitigation

1. **Accuracy Concerns**
   - Mitigation: Clear disclaimers, veterinary validation

2. **Privacy Issues**
   - Mitigation: Strong encryption, clear privacy policy

3. **API Costs**
   - Mitigation: Efficient caching, usage limits

4. **Competition**
   - Mitigation: First-mover advantage, superior UX

### Conclusion
What's Poopin' addresses a real need in pet health monitoring by providing instant, accessible health insights. By starting with dogs and expanding to other animals and humans, we can build a comprehensive platform for digestive health monitoring that improves the lives of pets and their owners.