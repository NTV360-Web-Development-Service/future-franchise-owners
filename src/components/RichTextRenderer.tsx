import React from 'react'
import Link from 'next/link'

/**
 * Represents a document reference in a link field
 */
interface DocumentReference {
  /** The collection this document belongs to (e.g., 'pages', 'franchises') */
  relationTo?: string
  /** The document ID */
  id?: string
  /** Nested value object containing document details */
  value?: {
    /** The collection this document belongs to */
    relationTo?: string
    /** The document ID */
    id?: string
    /** The slug for page documents */
    slug?: string
  }
}

/**
 * Link field configuration for Lexical link nodes
 */
interface LinkFields {
  /** Type of link: 'internal' for document references, 'custom' for external URLs */
  linkType?: 'internal' | 'custom'
  /** Custom color for the link (hex, rgb, or named color) */
  linkColor?: string
  /** Document reference for internal links */
  doc?: DocumentReference
  /** External URL for custom links */
  url?: string
  /** Whether to open link in a new tab */
  newTab?: boolean
  /** Array of rel attributes for the link (e.g., ['nofollow', 'noopener']) */
  rel?: string[]
}

/**
 * Lexical node structure representing content in the editor
 */
interface LexicalNode {
  /** Node type (e.g., 'paragraph', 'heading', 'link', 'text') */
  type?: string
  /** Text content for text nodes */
  text?: string
  /** Bitwise format flags: 1=bold, 2=italic, 8=code */
  format?: number
  /** Inline CSS styles as a string (e.g., 'color: red; background: blue') */
  style?: string
  /** Heading level for heading nodes (e.g., '1', '2', '3') */
  tag?: string
  /** List type for list nodes: 'number' for ordered, 'bullet' for unordered */
  listType?: 'number' | 'bullet'
  /** Child nodes for element nodes */
  children?: LexicalNode[]
  /** Link configuration for link nodes */
  fields?: LinkFields
}

/**
 * Root structure of Lexical content
 */
interface LexicalContent {
  /** Root node containing the document structure */
  root?: {
    /** Top-level child nodes */
    children?: LexicalNode[]
  }
}

/**
 * Props for the RichTextRenderer component
 */
interface RichTextRendererProps {
  /** The Lexical JSON content structure to render */
  content: LexicalContent
  /** Optional CSS class name to apply to the root container */
  className?: string
}

/**
 * RichTextRenderer - Renders Payload Lexical richtext content with proper link support.
 *
 * This component converts Lexical JSON format to HTML with clickable links,
 * supporting both external URLs and internal links to pages/franchises.
 * It handles various node types including paragraphs, headings, lists, links,
 * and inline formatting (bold, italic, code) with custom styling support.
 *
 * Features:
 * - Text formatting: bold, italic, code
 * - Block elements: paragraphs, headings (h1-h6), lists (ordered/unordered), blockquotes
 * - Links: internal (document references) and external (custom URLs)
 * - Custom styling: inline styles and link colors
 * - Accessibility: proper semantic HTML and link attributes
 *
 * @param {RichTextRendererProps} props - Component props
 * @returns {React.ReactElement | null} Rendered content or null if no content
 *
 * @example
 * ```tsx
 * <RichTextRenderer
 *   content={lexicalContent}
 *   className="prose max-w-none"
 * />
 * ```
 */
export function RichTextRenderer({ content, className = '' }: RichTextRendererProps) {
  if (!content?.root?.children) {
    return null
  }

  /**
   * Recursively renders a Lexical node and its children
   *
   * Handles different node types and applies appropriate formatting:
   * - Text nodes: applies bold, italic, code formatting and inline styles
   * - Element nodes: renders appropriate HTML elements (p, h1-h6, ul, ol, li, etc.)
   * - Link nodes: creates Next.js Link or anchor elements with proper attributes
   *
   * @param {LexicalNode} node - The Lexical node to render
   * @param {number} index - The index of the node in its parent's children array (used as React key)
   * @returns {React.ReactNode} The rendered React node
   */
  const renderNode = (node: LexicalNode, index: number): React.ReactNode => {
    // Handle text nodes with formatting
    if (node.text !== undefined) {
      let text: React.ReactNode = node.text

      // Apply text formatting (bold, italic, code)
      if (node.format) {
        if (node.format & 1) text = <strong key={index}>{text}</strong>
        if (node.format & 2) text = <em key={index}>{text}</em>
        if (node.format & 8) text = <code key={index}>{text}</code>
      }

      // Apply inline styles (color, background, etc.)
      if (node.style) {
        const styleObj = parseInlineStyles(node.style)
        if (Object.keys(styleObj).length > 0) {
          text = (
            <span key={index} style={styleObj}>
              {text}
            </span>
          )
        }
      }

      return text
    }

    // Handle element nodes
    switch (node.type) {
      case 'paragraph':
        return (
          <p key={index} className="mb-4">
            {node.children?.map((child, i) => renderNode(child, i))}
          </p>
        )

      case 'heading':
        const HeadingTag = `h${node.tag}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
        return React.createElement(
          HeadingTag,
          { key: index, className: 'font-bold mb-3' },
          node.children?.map((child, i) => renderNode(child, i)),
        )

      case 'list':
        const ListTag = node.listType === 'number' ? 'ol' : 'ul'
        return (
          <ListTag key={index} className="mb-4 ml-6 list-disc">
            {node.children?.map((child, i) => renderNode(child, i))}
          </ListTag>
        )

      case 'listitem':
        return (
          <li key={index} className="mb-1">
            {node.children?.map((child, i) => renderNode(child, i))}
          </li>
        )

      case 'link':
        return renderLinkNode(node, index, renderNode)

      case 'linebreak':
        return <br key={index} />

      case 'quote':
        return (
          <blockquote key={index} className="border-l-4 border-gray-300 pl-4 italic my-4">
            {node.children?.map((child, i) => renderNode(child, i))}
          </blockquote>
        )

      case 'span':
        const spanStyle = node.style ? parseInlineStyles(node.style) : {}
        return (
          <span key={index} style={Object.keys(spanStyle).length > 0 ? spanStyle : undefined}>
            {node.children?.map((child, i) => renderNode(child, i))}
          </span>
        )

      default:
        // Handle unknown node types by rendering children if available
        if (node.children) {
          return <span key={index}>{node.children.map((child, i) => renderNode(child, i))}</span>
        }
        return null
    }
  }

  return (
    <div className={className}>
      {content.root.children.map((node, index) => renderNode(node, index))}
    </div>
  )
}

/**
 * Parses inline CSS styles from a string and converts them to React CSSProperties
 *
 * Converts CSS property names from kebab-case to camelCase for React compatibility.
 * Handles multiple style declarations separated by semicolons.
 *
 * @param {string} styleString - CSS style string (e.g., "color: red; background-color: blue")
 * @returns {React.CSSProperties} React CSSProperties object with camelCase property names
 *
 * @example
 * ```ts
 * parseInlineStyles("color: red; font-size: 16px")
 * // Returns: { color: "red", fontSize: "16px" }
 * ```
 */
function parseInlineStyles(styleString: string): React.CSSProperties {
  const styleObj: Record<string, string> = {}
  const styles = styleString.split(';').filter(Boolean)

  styles.forEach((style) => {
    const [property, value] = style.split(':').map((s) => s.trim())
    if (property && value) {
      // Convert kebab-case to camelCase for React
      const camelProperty = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
      styleObj[camelProperty] = value
    }
  })

  return styleObj as React.CSSProperties
}

/**
 * Renders a link node with proper handling for internal and external links
 *
 * Supports two link types:
 * - Internal links: Uses Next.js Link component for client-side navigation to pages/franchises
 * - External links: Uses standard anchor tags with proper security attributes
 *
 * Features:
 * - Custom link colors with hover effects
 * - New tab/window support with security attributes (noopener, noreferrer)
 * - Automatic URL generation for internal document references
 * - Fallback rendering for invalid link configurations
 *
 * @param {LexicalNode} node - The link node to render
 * @param {number} index - The index of the node (used as React key)
 * @param {Function} renderNode - The render function for child nodes
 * @returns {React.ReactNode} Rendered link element (Link, anchor, or span)
 */
function renderLinkNode(
  node: LexicalNode,
  index: number,
  renderNode: (node: LexicalNode, index: number) => React.ReactNode,
): React.ReactNode {
  const linkColor = node.fields?.linkColor
  const linkStyle: React.CSSProperties = linkColor ? { color: linkColor } : {}
  const linkClassName = linkColor
    ? 'underline transition-opacity hover:opacity-80'
    : 'text-blue-600 underline hover:text-blue-800 transition-colors'

  // Handle internal links (relationship-based)
  if (node.fields?.linkType === 'internal' && node.fields?.doc) {
    const doc = node.fields.doc
    const collection = doc.relationTo || node.fields.doc?.value?.relationTo
    const id = typeof doc === 'object' ? doc.value?.id || doc.id : doc

    // Generate URL based on collection type
    let href = '/'
    if (collection === 'pages' && typeof doc.value === 'object') {
      href = `/${doc.value.slug}`
    } else if (collection === 'franchises') {
      href = `/franchises/${id}`
    }

    return (
      <Link
        key={index}
        href={href}
        className={linkClassName}
        style={linkStyle}
        {...(node.fields?.newTab && { target: '_blank', rel: 'noopener noreferrer' })}
      >
        {node.children?.map((child, i) => renderNode(child, i))}
      </Link>
    )
  }

  // Handle external links (custom URL)
  if (node.fields?.url) {
    return (
      <a
        key={index}
        href={node.fields.url}
        className={linkClassName}
        style={linkStyle}
        {...(node.fields?.newTab && { target: '_blank', rel: 'noopener noreferrer' })}
        {...(node.fields?.rel && { rel: node.fields.rel.join(' ') })}
      >
        {node.children?.map((child, i) => renderNode(child, i))}
      </a>
    )
  }

  // Fallback: render children without link wrapper
  return <span key={index}>{node.children?.map((child, i) => renderNode(child, i))}</span>
}
