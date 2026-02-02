# Client CSV Analysis - ffo.csv

## ❌ CRITICAL: CSV Structure Mismatch

The client's CSV file (`ffo.csv`) has a **completely different structure** than what your system expects.

---

## Client's CSV Structure (ffo.csv)

### Columns (6 total):
1. `Franchise` - Business name
2. `Industry` - Multiple industries comma-separated (e.g., "Health/Wellness, Senior Care: Medical/Non-medical")
3. `Investment Range` - Text format with dollar signs and ranges (e.g., "$91,195 - $166,012")
4. `Database` - Category like "Top Picks", "Main Listings"
5. `Short Description` - Brief description
6. `Long Description` - Detailed description

### Example Row:
```csv
Franchise,Industry,Investment Range,Database,Short Description,Long Description
A Place at Home,"Health/Wellness, Senior Care: Medical/Non-medical","$91,195 - $166,012",Top Picks,"A Place At Home is a non-medical in-home senior care franchise...","A Place At Home is a growing senior care franchise..."
```

---

## Your System's Expected CSV Structure

### Columns (11 total):
1. `businessName` - Business name
2. `description` - Full description (plain text)
3. `category` - Single category
4. `tags` - Semicolon-separated tags
5. `minInvestment` - Number (no formatting)
6. `maxInvestment` - Number (no formatting)
7. `agentEmail` - Agent email
8. `isFeatured` - true/false
9. `isSponsored` - true/false
10. `isTopPick` - true/false
11. `status` - draft/published/archived

### Example Row:
```csv
businessName,description,category,tags,minInvestment,maxInvestment,agentEmail,isFeatured,isSponsored,isTopPick,status
"FitZone Express","A 24/7 fitness franchise...","Fitness","fitness;gym;24-7","75000","200000","","true","false","true","published"
```

---

## Field Mapping Required

| Client CSV Column | Your System Field | Transformation Needed |
|------------------|-------------------|----------------------|
| `Franchise` | `businessName` | ✅ Direct mapping |
| `Industry` | `category` (industry) | ⚠️ **Split comma-separated, take first or create multiple** |
| `Investment Range` | `minInvestment` + `maxInvestment` | ⚠️ **Parse "$91,195 - $166,012" → min: 91195, max: 166012** |
| `Database` | `isFeatured`, `isSponsored`, `isTopPick` | ⚠️ **Map "Top Picks" → isTopPick=true, etc.** |
| `Short Description` | `shortDescription` | ✅ Direct mapping |
| `Long Description` | `description` | ✅ Direct mapping (convert to Lexical) |
| ❌ Missing | `tags` | ⚠️ **Could extract from Industry or leave empty** |
| ❌ Missing | `agentEmail` | ⚠️ **Leave empty** |
| ❌ Missing | `status` | ⚠️ **Default to "published"** |

---

## Specific Transformation Logic

### 1. Industry Field
**Client has**: `"Health/Wellness, Senior Care: Medical/Non-medical"`

**Options**:
- **Option A**: Take first industry only → `"Health/Wellness"`
- **Option B**: Split and create multiple industries → `["Health/Wellness", "Senior Care: Medical/Non-medical"]`
- **Option C**: Parse and clean → `["Health & Wellness", "Senior Care"]`

**Recommendation**: Option C - Parse, clean, and create multiple industries

### 2. Investment Range Field
**Client has**: `"$91,195 - $166,012"`

**Transformation**:
```javascript
const parseInvestmentRange = (range) => {
  // Remove $, commas, and spaces
  const cleaned = range.replace(/[$,\s]/g, '')
  
  // Split by dash or hyphen
  const parts = cleaned.split(/[-–—]/)
  
  return {
    min: parseInt(parts[0]) || 0,
    max: parseInt(parts[1]) || parseInt(parts[0]) || 0
  }
}

// Example: "$91,195 - $166,012" → { min: 91195, max: 166012 }
// Example: "$30,000" → { min: 30000, max: 30000 }
```

### 3. Database Field (Feature Flags)
**Client has**: `"Top Picks"`, `"Main Listings"`, `"Sponsored"` (possibly)

**Mapping**:
```javascript
const mapDatabaseToFlags = (database) => {
  const db = database.toLowerCase()
  
  return {
    isFeatured: db.includes('featured') || db.includes('main'),
    isSponsored: db.includes('sponsored'),
    isTopPick: db.includes('top pick') || db === 'top picks'
  }
}

// "Top Picks" → { isFeatured: false, isSponsored: false, isTopPick: true }
// "Main Listings" → { isFeatured: true, isSponsored: false, isTopPick: false }
```

### 4. Tags Field (Missing)
**Options**:
- **Option A**: Extract from Industry field → `"Health/Wellness"` → tags: `["health", "wellness"]`
- **Option B**: Leave empty
- **Option C**: Use Database field → `"Top Picks"` → tags: `["top-pick"]`

**Recommendation**: Option A - Extract from Industry

### 5. Description Fields
**Client has**: 
- `Short Description` → Maps to `shortDescription` ✅
- `Long Description` → Maps to `description` (needs Lexical conversion) ⚠️

---

## Required CSV Transformation Script

You need to create a transformation script that:

1. **Reads** `ffo.csv`
2. **Transforms** each row:
   - Parse investment range
   - Split and clean industries
   - Map database to feature flags
   - Extract tags from industries
   - Convert description to Lexical format
3. **Outputs** to your expected format OR directly imports to database

---

## Sample Transformation

### Input (Client CSV):
```csv
Franchise,Industry,Investment Range,Database,Short Description,Long Description
A Place at Home,"Health/Wellness, Senior Care: Medical/Non-medical","$91,195 - $166,012",Top Picks,"A Place At Home is...","A Place At Home is a growing..."
```

### Output (Your System):
```javascript
{
  businessName: "A Place at Home",
  shortDescription: "A Place At Home is...",
  description: {
    root: {
      type: 'root',
      children: [{
        type: 'paragraph',
        children: [{
          type: 'text',
          text: "A Place At Home is a growing..."
        }]
      }]
    }
  },
  industry: ["health-wellness-uuid", "senior-care-uuid"], // UUIDs after lookup/create
  tags: ["health-uuid", "wellness-uuid", "senior-care-uuid"], // UUIDs after lookup/create
  investment: {
    min: 91195,
    max: 166012
  },
  isFeatured: false,
  isSponsored: false,
  isTopPick: true,
  status: "published",
  assignedAgent: null,
  useMainContact: false
}
```

---

## Recommendations

### Immediate Action Required:

1. **Create a CSV transformation script** that converts `ffo.csv` to your expected format
2. **OR** Update your import route to handle the client's CSV format directly
3. **Validate** the transformation with a few sample rows before bulk import

### Best Approach:

**Option 1: Transform CSV First** (Recommended)
- Create a Node.js script to transform `ffo.csv` → `ffo-transformed.csv`
- Use the transformed CSV with your import route
- Easier to debug and validate

**Option 2: Update Import Route**
- Modify `/api/franchises/import/route.ts` to handle both formats
- Detect format by checking column names
- More flexible but more complex

---

## Next Steps

1. ✅ Identify the mismatch (DONE)
2. ⚠️ Choose transformation approach (Option 1 or 2)
3. ⚠️ Implement transformation logic
4. ⚠️ Test with sample data
5. ⚠️ Run full import
6. ⚠️ Verify data in database

---

## Summary

**Status**: ❌ **CSV formats are incompatible**

**Impact**: Cannot import directly without transformation

**Solution**: Create transformation script or update import route

**Estimated Effort**: 
- Transformation script: ~1-2 hours
- Import route update: ~2-3 hours
