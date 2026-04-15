const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_URL;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Boards
  async getBoards() {
    return this.request('/api/boards');
  }

  async getBoard(id: string) {
    return this.request(`/api/boards/${id}`);
  }

  async createBoard(data: any) {
    return this.request('/api/boards', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBoard(id: string, data: any) {
    return this.request(`/api/boards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBoard(id: string) {
    return this.request(`/api/boards/${id}`, {
      method: 'DELETE',
    });
  }

  async uploadBoardBackground(id: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${this.baseUrl}/api/boards/${id}/background`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload background');
    }
    return response.json();
  }

  // Lists
  async createList(data: any) {
    return this.request('/api/lists', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateList(id: string, data: any) {
    return this.request(`/api/lists/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateListPosition(id: string, data: any) {
    return this.request(`/api/lists/${id}/position`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteList(id: string) {
    return this.request(`/api/lists/${id}`, {
      method: 'DELETE',
    });
  }

  // Cards
  async getCard(id: string) {
    return this.request(`/api/cards/${id}`);
  }

  async createCard(data: any) {
    return this.request('/api/cards', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCard(id: string, data: any) {
    return this.request(`/api/cards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateCardPosition(id: string, data: any) {
    return this.request(`/api/cards/${id}/position`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCard(id: string) {
    return this.request(`/api/cards/${id}`, {
      method: 'DELETE',
    });
  }

  async uploadAttachment(cardId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    
    // We bypass this.request here because FormData needs browser-native content-type boundaries
    const response = await fetch(`${this.baseUrl}/api/cards/${cardId}/attachments`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload file');
    }
    return response.json();
  }

  async searchCards(params: any) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/api/cards/search?${query}`);
  }

  // Labels
  async createLabel(data: any) {
    return this.request('/api/labels', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateLabel(id: string, data: any) {
    return this.request(`/api/labels/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteLabel(id: string) {
    return this.request(`/api/labels/${id}`, {
      method: 'DELETE',
    });
  }

  async addLabelToCard(data: any) {
    return this.request('/api/labels/card', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async removeLabelFromCard(cardId: string, labelId: string) {
    return this.request(`/api/labels/${cardId}/${labelId}`, {
      method: 'DELETE',
    });
  }

  // Checklists
  async createChecklist(data: any) {
    return this.request('/api/checklists', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateChecklist(id: string, data: any) {
    return this.request(`/api/checklists/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteChecklist(id: string) {
    return this.request(`/api/checklists/${id}`, {
      method: 'DELETE',
    });
  }

  async createChecklistItem(data: any) {
    return this.request('/api/checklists/items', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateChecklistItem(id: string, data: any) {
    return this.request(`/api/checklists/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteChecklistItem(id: string) {
    return this.request(`/api/checklists/items/${id}`, {
      method: 'DELETE',
    });
  }

  // Comments
  async createComment(data: any) {
    return this.request('/api/comments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateComment(id: string, data: any) {
    return this.request(`/api/comments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteComment(id: string) {
    return this.request(`/api/comments/${id}`, {
      method: 'DELETE',
    });
  }

  // Members
  async getUsers() {
    return this.request('/api/members/users');
  }

  async addMemberToCard(data: any) {
    return this.request('/api/members/card', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async removeMemberFromCard(cardId: string, userId: string) {
    return this.request(`/api/members/card/${cardId}/${userId}`, {
      method: 'DELETE',
    });
  }

  // Activities
  async getBoardActivities(boardId: string, limit = 50) {
    return this.request(`/api/activities/board/${boardId}?limit=${limit}`);
  }
}

export const api = new ApiService();
