export const conversationGraphSchema = {
  type: 'object',
  required: ['id', 'name', 'entryNode', 'nodes', 'edges', 'version', 'description'],
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    description: { type: 'string' },
    version: { type: 'string' },
    entryNode: { type: 'string' },
    nodes: {
      type: 'object',
      additionalProperties: {
        type: 'object',
        required: ['type', 'content'],
        properties: {
          type: {
            enum: ['bot', 'user-input', 'decision', 'end', 'redirect']
          },
          content: {
            oneOf: [{ type: 'string' }, { type: 'array' }]
          }
        }
      }
    },
    edges: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'from', 'to', 'trigger'],
        properties: {
          id: { type: 'string' },
          from: { type: 'string' },
          to: { type: 'string' }
        }
      }
    }
  }
};
