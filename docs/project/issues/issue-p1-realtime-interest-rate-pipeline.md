# Issue P1: Real-Time Interest Rate Pipeline

**Issue ID**: P1-REALTIME-RATES  
**Priority**: P1 (High)  
**Status**: Open  
**Created**: 2025-06-18  
**Assignee**: Claude Code  

## Description

Implement an automated pipeline to retrieve real-time mortgage interest rates from major Dutch banks (ING, Rabobank, ABN AMRO), calculate averages, and automatically update the website daily via GitHub Actions.

## Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Bank Websites │    │  GitHub Actions  │    │   Next.js App   │
│   ING/RABO/ABN  │───▶│   Daily Runner   │───▶│   Rate Display  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │  Rate Data Store │
                       │   (JSON/API)     │
                       └──────────────────┘
```

## Technical Requirements

### 1. Data Collection Strategy

#### Bank Rate Sources
- **ING**: `https://www.ing.nl/particulier/hypotheken/actuele-hypotheekrente/`
- **Rabobank**: `https://www.rabobank.nl/particulieren/hypotheek/hypotheekrente/`
- **ABN AMRO**: `https://www.abnamro.nl/nl/prive/hypotheken/actuele-hypotheekrente/`

#### Data Extraction Methods
1. **Web Scraping** (Primary approach)
   - Use Playwright/Puppeteer for JavaScript-heavy sites
   - Parse HTML for rate tables
   - Handle dynamic content loading

2. **API Integration** (If available)
   - Check for public APIs or rate feeds
   - RSS/XML feeds if available
   - JSON endpoints if discoverable

### 2. GitHub Actions Pipeline

#### Workflow Components
```yaml
name: Update Interest Rates
on:
  schedule:
    - cron: '0 6 * * *'  # Daily at 6 AM UTC (8 AM CET)
  workflow_dispatch:     # Manual trigger

jobs:
  update-rates:
    runs-on: ubuntu-latest
    steps:
      - Checkout repository
      - Setup Node.js/Bun
      - Install dependencies
      - Run rate scraping script
      - Calculate averages
      - Update rate data file
      - Commit and push changes
      - Trigger website rebuild (if needed)
```

#### Data Storage Options
1. **JSON File in Repository**
   - Store rates in `public/data/interest-rates.json`
   - Version controlled, easy to track changes
   - Direct access from Next.js app

2. **External API/Database** (Future enhancement)
   - Firebase/Supabase for real-time updates
   - Better scalability and history tracking

### 3. Application Integration

#### Rate Display Components
- Update Interest component with live rates
- Add "Last updated" timestamp
- Show individual bank rates + average
- Historical trend indicators

#### Data Structure
```typescript
interface InterestRateData {
  lastUpdated: string;
  averageRates: {
    [period: string]: {
      nhg: number;
      standard: number;
    };
  };
  bankRates: {
    [bank: string]: {
      [period: string]: {
        nhg: number;
        standard: number;
      };
    };
  };
}
```

## Implementation Plan

### Phase 1: Research & Setup (Day 1)
- [ ] Analyze bank websites for rate data structure
- [ ] Test scraping approaches for each bank
- [ ] Design data schema and storage strategy
- [ ] Create GitHub Actions workflow foundation

### Phase 2: Scraping Implementation (Day 2-3)
- [ ] Build rate scraping scripts for each bank
- [ ] Implement error handling and retry logic
- [ ] Add data validation and sanitization
- [ ] Test scraping reliability and accuracy

### Phase 3: Pipeline Development (Day 4)
- [ ] Create GitHub Actions workflow
- [ ] Implement rate averaging calculations
- [ ] Add data persistence and versioning
- [ ] Set up automated testing

### Phase 4: Frontend Integration (Day 5)
- [ ] Update Interest component with live data
- [ ] Add rate comparison visualizations
- [ ] Implement fallback for offline/error scenarios
- [ ] Add rate change notifications

### Phase 5: Testing & Deployment (Day 6)
- [ ] End-to-end pipeline testing
- [ ] Error handling validation
- [ ] Performance optimization
- [ ] Documentation and monitoring setup

## Technical Challenges & Solutions

### Challenge 1: Website Changes
**Problem**: Bank websites may change structure
**Solution**: 
- Multiple selector strategies per bank
- Regular monitoring and alerts
- Graceful degradation when scraping fails

### Challenge 2: Rate-Limiting/Blocking
**Problem**: Banks may block automated requests
**Solution**:
- Randomized delays between requests
- User-agent rotation
- Proxy rotation if needed
- Respect robots.txt

### Challenge 3: Data Accuracy
**Problem**: Ensuring scraped data is correct
**Solution**:
- Cross-validation between banks
- Historical data comparison
- Manual verification alerts for outliers
- Rollback capability for bad data

### Challenge 4: Reliability
**Problem**: Pipeline failures could leave stale data
**Solution**:
- Retry mechanisms with exponential backoff
- Fallback to previous known good data
- Error notifications and monitoring
- Manual override capabilities

## Files to Create/Modify

### New Files
- `scripts/scrape-interest-rates.js` - Main scraping logic
- `.github/workflows/update-rates.yml` - GitHub Actions workflow
- `public/data/interest-rates.json` - Rate data storage
- `src/lib/rateService.ts` - Rate data access layer

### Modified Files
- `src/components/Interest.tsx` - Display live rates
- `src/common/Types.tsx` - Add rate data types
- `package.json` - Add scraping dependencies

## Monitoring & Maintenance

### Success Metrics
- Daily successful rate updates
- Data accuracy compared to manual checks
- Website uptime and performance
- User engagement with rate information

### Monitoring Setup
- GitHub Actions success/failure notifications
- Rate change alerts (significant deviations)
- Website performance monitoring
- Error logging and alerting

## Future Enhancements

### Phase 2 Features
- Historical rate charts and trends
- Rate change notifications for users
- Email alerts for significant rate changes
- More banks (Aegon, NIBC, etc.)

### Phase 3 Features
- Machine learning for rate predictions
- Real-time rate updates (multiple times daily)
- User personalization based on rate preferences
- Integration with mortgage application systems

## Compliance & Legal

### Considerations
- Respect bank websites' terms of service
- Implement appropriate rate limiting
- Add proper attribution and disclaimers
- Ensure data accuracy representations
- Consider caching and fair use policies

## Risk Assessment

### High Risk
- Bank websites blocking scraping attempts
- Legal issues with data extraction
- Data accuracy problems affecting user decisions

### Medium Risk
- Pipeline failures causing stale data
- Performance impact on website
- Maintenance overhead for website changes

### Low Risk
- Minor rate calculation discrepancies
- Temporary service interruptions
- User interface adjustment needs

## Success Criteria

- [ ] Automated daily rate collection from 3 major banks
- [ ] Accurate average rate calculations
- [ ] Reliable GitHub Actions pipeline (>95% success rate)
- [ ] Real-time rate display in application
- [ ] Error handling and fallback mechanisms
- [ ] Performance impact <100ms additional load time
- [ ] User-friendly rate comparison interface