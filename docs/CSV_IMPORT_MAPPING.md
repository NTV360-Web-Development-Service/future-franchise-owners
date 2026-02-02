# CSV Import Field Mapping Analysis

## Current CSV Columns
```
businessName, description, category, tags, minInvestment, maxInvestment, 
agentEmail, isFeatured, isSponsored, isTopPick, status
```

## Franchises Database Schema Fields

### ✅ Fields Covered by CSV

| Database Field | CSV Column | Type | Notes |
|---------------|------------|------|-------|
| `businessName` | `businessName` | text | ✅ Required - Matches |
| `description` | `description` | richText | ⚠️ CSV has plain text, DB expects richText/Lexical |
| `industry` | `category` | relationship[] | ⚠️ CSV uses single category, DB supports multiple industries |
| `tags` | `tags` | relationship[] | ✅ CSV semicolon-separated, DB is array |
| `investment.min` | `minInvestment` | number | ✅ Matches |
| `investment.max` | `maxInvestment` | number | ✅ Matches |
| `assignedAgent` | `agentEmail` | relationship | ⚠️ CSV has email, need to lookup agent by email |
| `isFeatured` | `isFeatured` | checkbox | ✅ Matches |
| `isSponsored` | `isSponsored` | checkbox | ✅ Matches |
| `isTopPick` | `isTopPick` | checkbox | ✅ Matches |
| `status` | `status` | select | ✅ Matches (draft/published/archived) |

### ❌ Database Fields NOT in CSV (Will use defaults)

| Database Field | Type | Default | Impact |
|---------------|------|---------|--------|
| `slug` | text | (empty) | Hidden field, optional - OK to skip |
| `shortDescription` | text | (empty) | Optional - Could extract from description |
| `investment.badgeColor` | text | (empty) | Optional - Uses default styling |
| `investment.badgeTextColor` | text | `#ffffff` | Optional - Uses default white |
| `logo` | upload/relationship | (empty) | Optional - No logo on import |
| `useMainContact` | checkbox | `false` | Optional - Uses agent if assigned |
| `createdBy` | relationship | (auto) | Auto-filled by audit hook |
| `updatedBy` | relationship | (auto) | Auto-filled by audit hook |
| `createdAt` | timestamp | (auto) | Auto-filled by Payload |
| `updatedAt` | timestamp | (auto) | Auto-filled by Payload |

### 🔍 Potential Issues

#### 1. **Description Field Mismatch**
- **CSV**: Plain text string
- **Database**: Lexical richText (JSON structure)
- **Solution**: Convert plain text to Lexical format during import

#### 2. **Category vs Industry**
- **CSV**: Single `category` column
- **Database**: `industry` field that accepts **multiple** relationships
- **Solution**: Import single category as array with one item, but CSV could support multiple

#### 3. **Agent Email Lookup**
- **CSV**: `agentEmail` (string)
- **Database**: `assignedAgent` (UUID relationship)
- **Solution**: Query agents collection by email, get UUID

#### 4. **Missing Optional Fields**
- `shortDescription` - Could auto-generate from first 150 chars of description
- `logo` - Would need separate upload process or URL column
- `investment.badgeColor` - Could add to CSV if needed
- `investment.badgeTextColor` - Could add to CSV if needed

---

## Recommended CSV Structure (Enhanced)

### Option 1: Minimal (Current - Works Fine)
```csv
businessName,description,category,tags,minInvestment,maxInvestment,agentEmail,isFeatured,isSponsored,isTopPick,status
```
**Status**: ✅ Sufficient for basic import

### Option 2: Enhanced (Recommended)
```csv
businessName,shortDescription,description,categories,tags,minInvestment,maxInvestment,investmentBadgeColor,investmentBadgeTextColor,logoUrl,agentEmail,isFeatured,isSponsored,isTopPick,useMainContact,status
```

**Changes**:
- Add `shortDescription` for better SEO/cards
- Rename `category` → `categories` (supports multiple: "Fitness;Food and Beverage")
- Add `investmentBadgeColor` and `investmentBadgeTextColor` for custom styling
- Add `logoUrl` for automatic logo download/upload
- Add `useMainContact` flag

### Option 3: Minimal + Short Description (Balanced)
```csv
businessName,shortDescription,description,category,tags,minInvestment,maxInvestment,agentEmail,isFeatured,isSponsored,isTopPick,status
```

**Changes**:
- Add `shortDescription` only (most valuable addition)

---

## Import Logic Requirements

### 1. Text to Lexical Conversion
```typescript
// Convert plain text to Lexical format
function textToLexical(text: string) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              type: 'text',
              format: 0,
              style: '',
              mode: 'normal',
              detail: 0,
              text: text,
              version: 1,
            },
          ],
        },
      ],
      direction: 'ltr',
    },
  }
}
```

### 2. Category/Industry Lookup or Create
```typescript
async function getOrCreateIndustry(name: string, payload: Payload) {
  // Search by name
  const existing = await payload.find({
    collection: 'industries',
    where: { name: { equals: name } },
    limit: 1,
  })
  
  if (existing.docs.length > 0) {
    return existing.docs[0].id
  }
  
  // Create new
  const created = await payload.create({
    collection: 'industries',
    data: {
      name: name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      icon: 'Briefcase', // Default
    },
  })
  
  return created.id
}
```

### 3. Tag Lookup or Create
```typescript
async function getOrCreateTags(tagString: string, payload: Payload) {
  const tagNames = tagString.split(';').map(t => t.trim()).filter(Boolean)
  const tagIds = []
  
  for (const tagName of tagNames) {
    const existing = await payload.find({
      collection: 'tags',
      where: { name: { equals: tagName } },
      limit: 1,
    })
    
    if (existing.docs.length > 0) {
      tagIds.push(existing.docs[0].id)
    } else {
      const created = await payload.create({
        collection: 'tags',
        data: {
          name: tagName,
          slug: tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          type: 'feature',
        },
      })
      tagIds.push(created.id)
    }
  }
  
  return tagIds
}
```

### 4. Agent Lookup by Email
```typescript
async function getAgentByEmail(email: string, payload: Payload) {
  if (!email || email.trim() === '') return null
  
  const agents = await payload.find({
    collection: 'agents',
    where: { email: { equals: email.trim() } },
    limit: 1,
  })
  
  return agents.docs.length > 0 ? agents.docs[0].id : null
}
```

---

## Validation Rules

### Required Fields
- `businessName` - Must not be empty
- `description` - Must not be empty
- `category` - Must not be empty
- `minInvestment` - Must be a valid number
- `maxInvestment` - Must be a valid number, >= minInvestment

### Optional Fields
- `tags` - Can be empty
- `agentEmail` - Can be empty (no agent assigned)
- `isFeatured` - Defaults to false if empty
- `isSponsored` - Defaults to false if empty
- `isTopPick` - Defaults to false if empty
- `status` - Defaults to 'draft' if empty

### Data Type Conversions
- Boolean fields: Accept "true", "false", "1", "0", "yes", "no" (case-insensitive)
- Numbers: Parse and validate as integers
- Text: Trim whitespace

---

## Conclusion

### Current CSV Status: ✅ **FUNCTIONAL BUT BASIC**

Your current CSV structure will work, but with these considerations:

1. **Description** will be converted from plain text to Lexical format
2. **Category** will be treated as a single industry (even though DB supports multiple)
3. **No logo** will be imported (would need manual upload after)
4. **No shortDescription** (cards will use truncated description)
5. **No custom badge colors** (will use defaults)

### Recommendations:

**For immediate use**: Current CSV is fine ✅

**For better results**: Add `shortDescription` column (Option 3)

**For full features**: Use enhanced CSV (Option 2)

---

## Updated Sample CSV (Option 3 - Recommended)

```csv
businessName,shortDescription,description,category,tags,minInvestment,maxInvestment,agentEmail,isFeatured,isSponsored,isTopPick,status
"FitZone Express","24/7 fitness franchise with state-of-the-art equipment and personal training.","A 24/7 fitness franchise featuring state-of-the-art equipment, personal training services, and group fitness classes. Perfect for busy professionals and fitness enthusiasts.","Fitness","fitness;gym;24-7;personal training;group classes","75000","200000","","true","false","true","published"
```
