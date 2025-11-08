"""
WebSocket connection manager for real-time updates.
"""
from typing import Dict, List
from fastapi import WebSocket
import json
import structlog

logger = structlog.get_logger()

class WebSocketManager:
    """Manages WebSocket connections for real-time updates."""
    
    def __init__(self):
        # Store active connections
        self.active_connections: Dict[str, WebSocket] = {}
        self.connection_groups: Dict[str, List[str]] = {}
    
    async def connect(self, websocket: WebSocket, client_id: str):
        """Accept a new WebSocket connection."""
        await websocket.accept()
        self.active_connections[client_id] = websocket
        logger.info("WebSocket connected", client_id=client_id)
        
        # Send welcome message
        await self.send_personal_message({
            "type": "connection",
            "message": "Connected successfully",
            "client_id": client_id
        }, client_id)
    
    def disconnect(self, client_id: str):
        """Remove a WebSocket connection."""
        if client_id in self.active_connections:
            del self.active_connections[client_id]
            logger.info("WebSocket disconnected", client_id=client_id)
        
        # Remove from groups
        for group_name, members in self.connection_groups.items():
            if client_id in members:
                members.remove(client_id)
    
    async def send_personal_message(self, message: dict, client_id: str):
        """Send a message to a specific client."""
        if client_id in self.active_connections:
            try:
                websocket = self.active_connections[client_id]
                await websocket.send_text(json.dumps(message))
            except Exception as e:
                logger.error("Failed to send message", client_id=client_id, exc_info=e)
                # Remove disconnected client
                self.disconnect(client_id)
    
    async def broadcast_to_group(self, message: dict, group_name: str):
        """Broadcast a message to all clients in a group."""
        if group_name in self.connection_groups:
            disconnected_clients = []
            
            for client_id in self.connection_groups[group_name]:
                try:
                    websocket = self.active_connections.get(client_id)
                    if websocket:
                        await websocket.send_text(json.dumps(message))
                    else:
                        disconnected_clients.append(client_id)
                except Exception as e:
                    logger.error("Failed to broadcast message", client_id=client_id, exc_info=e)
                    disconnected_clients.append(client_id)
            
            # Clean up disconnected clients
            for client_id in disconnected_clients:
                self.disconnect(client_id)
    
    async def broadcast_to_all(self, message: dict):
        """Broadcast a message to all connected clients."""
        disconnected_clients = []
        
        for client_id, websocket in self.active_connections.items():
            try:
                await websocket.send_text(json.dumps(message))
            except Exception as e:
                logger.error("Failed to broadcast message", client_id=client_id, exc_info=e)
                disconnected_clients.append(client_id)
        
        # Clean up disconnected clients
        for client_id in disconnected_clients:
            self.disconnect(client_id)
    
    def add_to_group(self, client_id: str, group_name: str):
        """Add a client to a group."""
        if group_name not in self.connection_groups:
            self.connection_groups[group_name] = []
        
        if client_id not in self.connection_groups[group_name]:
            self.connection_groups[group_name].append(client_id)
            logger.info("Client added to group", client_id=client_id, group=group_name)
    
    def remove_from_group(self, client_id: str, group_name: str):
        """Remove a client from a group."""
        if group_name in self.connection_groups:
            if client_id in self.connection_groups[group_name]:
                self.connection_groups[group_name].remove(client_id)
                logger.info("Client removed from group", client_id=client_id, group=group_name)
    
    def get_connection_count(self) -> int:
        """Get the number of active connections."""
        return len(self.active_connections)
    
    def get_group_members(self, group_name: str) -> List[str]:
        """Get members of a group."""
        return self.connection_groups.get(group_name, [])

# Utility functions for common WebSocket message types
def create_analysis_update_message(
    analysis_id: str,
    status: str,
    progress: int,
    message: str = ""
) -> dict:
    """Create a standardized analysis update message."""
    return {
        "type": "analysis_update",
        "data": {
            "analysis_id": analysis_id,
            "status": status,
            "progress": progress,
            "message": message
        }
    }

def create_error_message(error: str, code: str = "GENERAL_ERROR") -> dict:
    """Create a standardized error message."""
    return {
        "type": "error",
        "data": {
            "code": code,
            "message": error
        }
    }

def create_notification_message(
    title: str,
    message: str,
    type: str = "info"
) -> dict:
    """Create a standardized notification message."""
    return {
        "type": "notification",
        "data": {
            "title": title,
            "message": message,
            "notification_type": type,
            "timestamp": "2024-01-01T00:00:00Z"  # Would use datetime.utcnow().isoformat()
        }
    }
