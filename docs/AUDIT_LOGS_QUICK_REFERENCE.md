# Audit Logs Quick Reference

## 🎯 What Are Audit Fields?

Automatic tracking of who creates and updates records in Payload CMS.

## 📋 Fields Added

Every collection now has:

- **createdBy** → User who created the record
- **updatedBy** → User who last updated the record
- **createdAt** → When created (Payload default)
- **updatedAt** → When last updated (Payload default)

## ✅ Collections with Audit Tracking

- Franchises
- Pages
- Contact Submissions
- Agents
- Industries
- Tags

## 🔍 Where to See Them

In Payload Admin:

1. Open any record
2. Look at the **sidebar** (right side)
3. See "Created By" and "Updated By"

## 💻 Code Examples

### Create with Audit Tracking

```typescript
const franchise = await payload.create({
  collection: 'franchises',
  user: req.user, // ← Pass user for audit tracking
  data: {
    name: 'My Franchise',
  },
})
```

### Update with Audit Tracking

```typescript
const updated = await payload.update({
  collection: 'franchises',
  id: franchiseId,
  user: req.user, // ← Pass user for audit tracking
  data: {
    name: 'Updated Name',
  },
})
```

### Query by Creator

```typescript
const myRecords = await payload.find({
  collection: 'franchises',
  where: {
    createdBy: { equals: userId },
  },
})
```

### Query Recent Updates

```typescript
const recent = await payload.find({
  collection: 'franchises',
  sort: '-updatedAt',
  limit: 10,
})
```

### Get User Info

```typescript
const franchise = await payload.findByID({
  collection: 'franchises',
  id: franchiseId,
  depth: 2, // ← Populate user relationships
})

console.log(franchise.createdBy.name)
console.log(franchise.updatedBy.name)
```

## 🛠️ Adding to New Collections

```typescript
import { auditFields } from './fields/auditFields'

const MyCollection: CollectionConfig = {
  slug: 'my-collection',
  fields: [
    // Your fields here
    {
      name: 'title',
      type: 'text',
    },
    // Add audit fields at the end
    ...auditFields,
  ],
}
```

## ⚠️ Important Notes

- Audit fields are **read-only** (users can't edit them)
- They're **optional** (backward compatible)
- Existing records will have `null` until updated
- New records get them automatically
- Always pass `user` context when creating/updating

## 🚫 Don't Add To

- **Media** → Already has uploader tracking
- **Users** → Would create circular reference

## 📚 Full Documentation

- [AUDIT_LOGS.md](./AUDIT_LOGS.md) - Complete guide
- [AUDIT_LOGS_VERIFICATION.md](./AUDIT_LOGS_VERIFICATION.md) - Testing guide
- [AUDIT_LOGS_IMPLEMENTATION_SUMMARY.md](./AUDIT_LOGS_IMPLEMENTATION_SUMMARY.md) - Technical details

---

**Status**: ✅ Complete and Production Ready
