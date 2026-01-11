
import { Item, Enemy, Skill, PlayerClass, ItemMod, ClassDefinition, EquipmentWeight, Position } from './types';

export const DUNGEON_SIZE = 20;

export const TEXTURE_WALL_BRICK = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBzaGFwZS1yZW5kZXJpbmc9ImNyaXNwRWRnZXMiPjxyZWN0IHdpZHRoPSI2NCIgaGVpZGhtoPSI2NCIgZmlsbD0iIzEwMTAxMCIvPjxyZWN0IHdpZHRoPSI2NCIgaGVpZGToPSIyIiBmaWxsPSIjMDAzMzAwIi8+PHJlY3QgeT0iMTUiIHdpZHRoPSI2NCIgaGVpZGhtoPSIyIiBmaWxsPSIjMDAzMzAwIi8+PHJlY3QgeT0iMzEiIHdpZHRoPSI2NCIgaGVpZ2h0PSIyIiBmaWxsPSIjMDAzMzAwIi8+PHJlY3QgeT0iNDciIHdpZHRoPSI2NCIgaGVpZ2h0PSIyIiBmaWxsPSIjMDAzMzAwIi8+PHJlY3QgeD0iMzEiIHk9IjIiIHdpZHRoPSIyIiBoZWlnaHQ9IjEzIiBmaWxsPSIjMDAzMzAwIi8+PHJlY3QgeD0iMTUiIHk9IjE3IiB3aWR0aD0iMiIgaGVpZ2h0PSIxNCIgZmlsbD0iIzAwMzMwMCIvPjxyZWN0IHg9IjQ3IiB5PSIxNyIgd2lkdGg9IjIiIGhlaWdodD0iMTQiIGZpbGw9IiMwMDMzMDAiLz48cmVjdCB4PSIzMSIgeT0iMzMiIHdpZHRoPSIyIiBoZWlnaHQ9IjE0IiBmaWxsPSIjMDAzMzAwIi8+PHJlY3QgeD0iMTUiIHk9IjQ5IiB3aWR0aD0iMiIgaGVpZ2h0PSIxNSIgZmlsbD0iIzAwMzMwMCIvPjxyZWN0IHg9IjQ3IiB5PSI0OSIgd2lkdGg9IjIiIGhlaWdodD0iMTUiIGZpbGw9IiMwMDMzMDAiLz48L3N2Zz4=";
// Grey Stone Texture
export const TEXTURE_WALL_STONE = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBzaGFwZS1yZW5kZXJpbmc9ImNyaXNwRWRnZXMiPjxyZWN0IHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgZmlsbD0iIzIzMjMyMyIvPjxyZWN0IHdpZHRoPSI2NCIgaGVpZ2h0PSIyIiBmaWxsPSIjNDQ0NDQ0Ii8+PHJlY3QgeT0iMzEiIHdpZHRoPSI2NCIgaGVpZ2h0PSIyIiBmaWxsPSIjNDQ0NDQ0Ii8+PHJlY3QgeD0iMzEiIHdpZHRoPSIyIiBoZWlnaHQ9IjY0IiBmaWxsPSIjNDQ0NDQ0Ii8+PHBhdGggZD0iTTggOEg0VjRIMjhWMEgweiIgZmlsbD0iIzU1NTU1NSIgb3BhY2l0eT0iMC41Ii8+PHBhdGggZD0iTTQwIDhIMzZWNEg1OFYwSDMyeiIgZmlsbD0iIzU1NTU1NSIgb3BhY2l0eT0iMC41Ii8+PHBhdGggZD0iTTggNDBIMzZWMzZIMjhWMzJIMHoiIGZpbGw9IiM1NTU1NTUiIG9wYWNpdHk9IjAuNSIvPjxwYXRoIGQ9Ik00MCA0MEgzNlYzNkg1OFYzMkgzMnoiIGZpbGw9IiM1NTU1NTUiIG9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==";
export const TEXTURE_WALL_METAL = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBzaGFwZS1yZW5kZXJpbmc9ImNyaXNwRWRnZXMiPjxyZWN0IHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgZmlsbD0iIzIwMjAyMCIvPjxyZWN0IHdpZHRoPSI2NCIgaGVpZ2h0PSIxIiBmaWxsPSIjMDAwIi8+PHJlY3QgeT0iNjMiIHdpZHRoPSI2NCIgaGVpZ2h0PSIxIiBmaWxsPSIjMDAwIi8+PHJlY3QgeD0iNjMiIHdpZHRoPSIxIiBoZWlnaHQ9IjY0IiBmaWxsPSIjMDAwIi8+PHJlY3Qgd2lkdGg9IjEiIGhlaWdodD0iNjQiIGZpbGw9IiMwMDAwMDAiLz48Y2lyY2xlIGN4PSI1IiBjeT0iNSIgcj0iMSIgZmlsbD0iIzQwNDA0MCIvPjxjaXJjbGUgY3g9IjU5IiBjeT0iNSIgcj0iMSIgZmlsbD0iIzQwNDA0MCIvPjxjaXJjbGUgY3g9IjU5IiBjeT0iNTkiIHI9IjEiIGZpbGw9IiM0MDQwNDAiLz48Y2lyY2xlIGN4PSI1IiBjeT0iNTkiIHI9IjEiIGZpbGw9IiM0MDQwNDAiLz48L3N2Zz4=";
export const TEXTURE_WALL_CITY = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBzaGFwZS1yZW5kZXJpbmc9ImNyaXNwRWRnZXMiPjxyZWN0IHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgZmlsbD0iIzEyMTIxMiIvPjxyZWN0IHdpZHRoPSI2NCIgaGVpZ2h0PSIyIiBmaWxsPSIjMDAwIi8+PHJlY3QgeT0iNjIiIHdpZHRoPSI2NCIgaGVpZ2h0PSIyIiBmaWxsPSIjMDAwIi8+PHJlY3QgeT0iMzEiIHdpZHRoPSI2NCIgaGVpZ2h0PSIyIiBmaWxsPSIjMDAwIi8+PHJlY3QgeD0iMzEiIHk9IjIiIHdpZHRoPSIyIiBoZWlnaHQ9IjI5IiBmaWxsPSIjMDAwIi8+PHJlY3QgeD0iMzEiIHk9IjMzIiB3aWR0aD0iMiIgaGVpZ2h0PSIyOSIgZmlsbD0iIzAwMCIvPjwvc3ZnPg==";
export const TEXTURE_DOOR = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBzaGFwZS1yZW5kZXJpbmc9ImNyaXNwRWRnZXMiPjxyZWN0IHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgZmlsbD0iIzI2MWMxNCIvPjxyZWN0IHg9IjQiIHk9IjQiIHdpZHRoPSI1NiIgaGVpZ2h0PSI1NiIgZmlsbD0iIzM4MjUwZSIvPjxyZWN0IHg9IjgiIHk9IjgiIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgZmlsbD0iIzRjMzIxNCIvPjxyZWN0IHg9IjI4IiB5PSI0IiB3aWR0aD0iOCIgaGVpZ2h0PSI1NiIgZmlsbD0iIzE4MTAwOSIvPjxyZWN0IHg9IjQiIHk9IjI4IiB3aWR0aD0iNTYiIGhlaWdodD0iOCIgZmlsbD0iIzE4MTAwOSIvPjxyZWN0IHg9IjUyIiB5PSIzNCIgd2lkdGg9IjQiIGhlaWdodD0iOCIgZmlsbD0iIzE4MTAwOSIvPjwvc3ZnPg==";
// Updated to look like a side view of a stone fountain with water
export const TEXTURE_FOUNTAIN = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiMyMjIiLz48cmVjdCB4PSI4IiB5PSI0MCIgd2lkdGg9NHgiNDgiIGhlaWdodD0iMjQiIGZpbGw9IiM1NTUiLz48cmVjdCB4PSIxMiIgeT0iNDQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0IiBmaWxsPSIjMzMzOWVmIiBvcGFjaXR5PSIwLjgiLz48cmVjdCB4PSIyOCIgeT0iMTYiIHdpZHRoPSI4IiBoZWlnaHQ9IjI0IiBmaWxsPSIjNDQ0Ii8+PGNpcmNsZSBjeD0iMzIiIGN5PSIxMiIgcj0iOCIgZmlsbD0iIzMzMzllZiIvPjxwYXRoIGQ9Ik0zMiAxMiBMNDggNDAgTDQ0IDQ0IEwyOCAxNiBaIiBmaWxsPSIjMzMzOWVmIiBvcGFjaXR5PSIwLjQiLz48L3N2Zz4=";
/** @deprecated Use TEXTURE_FOUNTAIN instead. */
export const SPRITE_FOUNTAIN = TEXTURE_FOUNTAIN;

// --- AVATARS ---

export const MERCHANT_AVATAR = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48IS0tIEhvb2QgLS0+PHJlY3QgeD0iMTYiIHk9IjgiIHdpZHRoPSIzMiIgaGVpZ2h0PSI0OCIgZmlsbD0iIzAwMTMwMCIvPjxyZWN0IHg9IjIwIiB5PSI0IiB3aWR0aD0iMjQiIGhlaWdodD0iNTIiIGZpbGw9IiMwMDEzMDAiLz48IS0tIEZhY2UgQmFzZSAtLT48cmVjdCB4PSIyNCIgeT0iMTYiIHdpZHRoPSIxNiIgaGVpZ2h0PSIyNCIgZmlsbD0iIzAwMzMwMCIvPjxyZWN0IHg9IjI2IiB5PSIxNCIgd2lkdGg9IjEyIiBoZWlnaHQ9IjIiIGZpbGw9IiMwMDMzMDAiLz48IS0tIENoZWVrYm9uZXMgJiBGb3JlaGVhZCAtLT48cmVjdCB4PSIyOCIgeT0iMTYiIHdpZHRoPSI4IiBoZWlnaHQ9IjIwIiBmaWxsPSIjMDA0NDAwIi8+PHJlY3QgeD0iMjYiIHk9IjIwIiB3aWR0aD0iMTIiIGhlaWdodD0iNCIgZmlsbD0iIzAwNDQwMCIvPjwhLS0gRXllcyAtLT48cmVjdCB4PSIyNyIgeT0iMjQiIHdpZHRoPSI0IiBoZWlnaHQ9IjIiIGZpbGw9IiMwMDExMDAiLz48cmVjdCB4PSIzMyIgeT0iMjQiIHdpZHRoPSI0IiBoZWlnaHQ9IjIiIGZpbGw9IiMwMDExMDAiLz48IS0tIEdsb3dpbmcgUHVwaWxzIC0tPjxyZWN0IHg9IjI4IiB5PSIyNCIgd2lkdGg9IjIiIGhlaWdodD0iMiIgZmlsbD0iIzMzZmYzMyIvPjxyZWN0IHg9IjM0IiB5PSIyNCIgd2lkdGg9IjIiIGhlaWdodD0iMiIgZmlsbD0iIzMzZmYzMyIvPjxyZWN0IHg9IjI5IiB5PSIyNCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iI2ZmZmZmZiIvPjxyZWN0IHg9IjM1IiB5PSIyNCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iI2ZmZmZmZiIvPjwhLS0gTm9zZSAtLT48cmVjdCB4PSIzMSIgeT0iMjgiIHdpZHRoPSIyIiBoZWlnaHQ9IjMiIGZpbGw9IiMwMDIyMDAiLz48IS0tIE1vdXRoIC8gQ2hpbiAtLT48cmVjdCB4PSIzMCIgeT0iMzYiIHdpZHRoPSI0IiBoZWlnaHQ9IjIiIGZpbGw9IiMwMDExMDAiLz48cmVjdCB4PSIyOCIgeT0iMzgiIHdpZHRoPSI4IiBoZWlnaHQ9IjIiIGZpbGw9IiMwMDIyMDAiLz48IS0tIERpZ2l0YWwgQmVhcmQgLS0+PHJlY3QgeD0iMjYiIHk9IjQwIiB3aWR0aD0iMTIiIGhlaWdodD0iNCIgZmlsbD0iIzAwNjYwMCIgb3BhY2l0eT0iMC42Ii8+PHJlY3QgeD0iMjQiIHk9IjQ0IiB3aWR0aD0iMTYiIGhlaWdodD0iMiIgZmlsbD0iIzAwNjYwMCIgb3BhY2l0eT0iMC4zIi8+PC9zdmc+";

export const AVATAR_TRAVELER = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48IS0tIENsb2FrIC0tPjxyZWN0IHg9IjE2IiB5PSI4IiB3aWR0aD0iMzIiIGhlaWdodD0iNDgiIGZpbGw9IiM1YzQwMzMiLz48cmVjdCB4PSIyMCIgeT0iNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjUyIiBmaWxsPSIjNWM0MDMzIi8+PCEtLSBEYXJrIEludGVyaW9yIC0tPjxyZWN0IHg9IjI0IiB5PSIxNiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjMmUyZTMzIi8+PCEtLSBFeWVzIChIaWRkZW4gaW4gc2hhZG93KSAtLT48cmVjdCB4PSIyNiIgeT0iMjAiIHdpZHRoPSI0IiBoZWlnaHQ9IjIiIGZpbGw9IiNhYWZmYWEiIG9wYWNpdHk9IjAuNiIvPjxyZWN0IHg9IjM0IiB5PSIyMCIgd2lkdGg9IjQiIGhlaWdodD0iMiIgZmlsbD0iI2FhZmZhYSIgb3BhY2l0eT0iMC42Ii8+PCEtLSBTY2FyZiAtLT48cmVjdCB4PSIyMiIgeT0iMzIiIHdpZHRoPSIyMCIgaGVpZ2h0PSI4IiBmaWxsPSIjOGI0NTEzIi8+PCEtLSBCcm93biBCb290cyAtLT48cmVjdCB4PSIyMCIgeT0iNTYiIHdpZHRoPSI4IiBoZWlnaHQ9IjQiIGZpbGw9IiM0YTI4MTciLz48cmVjdCB4PSIzNCIgeT0iNTYiIHdpZHRoPSI4IiBoZWlnaHQ9IjQiIGZpbGw9IiM0YTI4MTciLz48L3N2Zz4=";

export const AVATAR_VILLAGER = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48IS0tIFJvYmUgLS0+PHJlY3QgeD0iMTYiIHk9IjgiIHdpZHRoPSIzMiIgaGVpZ2h0PSI0OCIgZmlsbD0iIzM1MjUzNSIvPjxyZWN0IHg9IjIwIiB5PSI0IiB3aWR0aD0iMjQiIGhlaWdodD0iNTYiIGZpbGw9IiMzNTI1MzUiLz48IS0tIEhvb2QgLS0+PHJlY3QgeD0iMjQiIHk9IjE2IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9IiMyNDFiMjYiLz48IS0tIEJlbHQgLS0+PHJlY3QgeD0iMTYiIHk9IjMyIiB3aWR0aD0iMzIiIGhlaWdodD0iNCIgZmlsbD0iIzRjMzYyYyIvPjwhLS0gRXllcyAtLT48cmVjdCB4PSIyOCIgeT0iMjIiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiNmZmRhYWEiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiNmZmRhYWEiLz48L3N2Zz4=";

export const AVATAR_GHOST = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48cmVjdCB4PSIyMCIgeT0iMTYiIHdpZHRoPSIyNCIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMC40Ii8+PHJlY3QgeD0iMTYiIHk9IjIwIiB3aWR0aD0iMzIiIGhlaWdodD0iMjgiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuMyIvPjxyZWN0IHg9IjIwIiB5PSI1MiIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMC4yIi8+PHJlY3QgeD0iMjgiIHk9IjUyIiB3aWR0aD0iOCIgaGVpZ2h0PSI2IiBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjI1Ii8+PHJlY3QgeD0iNDAiIHk9IjUyIiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjIiLz48cmVjdCB4PSIyNiIgeT0iMjgiIHdpZHRoPSI0IiBoZWlnaHQ9IjYiIGZpbGw9IiMwMGZmZmYiLz48cmVjdCB4PSIzNCIgeT0iMjgiIHdpZHRoPSI0IiBoZWlnaHQ9IjYiIGZpbGw9IiMwMGZmZmYiLz48cmVjdCB4PSIyNyIgeT0iMzAiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiNmZmZmZmYiLz48cmVjdCB4PSIzNSIgeT0iMzAiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiNmZmZmZmYiLz48L3N2Zz4=";

// --- PLAYER CLASSES ---

const AVATAR_WARRIOR = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiMwMDAwMDAiLz48cmVjdCB4PSIxNiIgeT0iMTIiIHdpZHRoPSIzMiIgaGVpZ2h0PSI0MCIgZmlsbD0iIzAwMzMwMCIvPjxyZWN0IHg9IjE4IiB5PSIxMCIgd2lkdGg9IjI4IiBoZWlnaHQ9IjQiIGZpbGw9IiMwMDU1MDAiLz48cmVjdCB4PSIyMCIgeT0iMjQiIHdpZHRoPSIyNCIgaGVpZ2h0PSI2IiBmaWxsPSIjMDAwMDAwIi8+PHJlY3QgeD0iMjIiIHk9IjI2IiB3aWR0aD0iMjAiIGhlaWdodD0iMiIgZmlsbD0iIzMzZmYzMyIvPjxyZWN0IHg9IjMwIiB5PSIzMiIgd2lkdGg9IjQiIGhlaWdodD0iMTQiIGZpbGw9IiMwMDU1MDAiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyIiBmaWxsPSIjMDA0NDAwIi8+PHJlY3QgeD0iMjQiIHk9IjQ4IiB3aWR0aD0iMTYiIGhlaWdodD0iNCIgZmlsbD0iIzAwNTUwMCIvPjwvc3ZnPg==";
// Fixed Mage Sprite (Clean Base64) - GREEN VER.
const AVATAR_MAGE = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiMwMDAwMDAiLz48cmVjdCB4PSIxNiIgeT0iMTAiIHdpZHRoPSIzMiIgaGVpZ2h0PSI0NiIgZmlsbD0iIzAwNDQwMCIvPjxyZWN0IHg9IjIwIiB5PSI2IiB3aWR0aD0iMjQiIGhlaWdodD0iMTIiIGZpbGw9IiMwMDQ0MDAiLz48cmVjdCB4PSIyMiIgeT0iMTgiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iIzAwMjIwMCIvPjxyZWN0IHg9IjI2IiB5PSIyNCIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iIzMzZmYzMyIvPjxyZWN0IHg9IjM0IiB5PSIyNCIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iIzMzZmYzMyIvPjwvc3ZnPg==";
const AVATAR_CLERIC = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiMwMDAwMDAiLz48cmVjdCB4PSIxOCIgeT0iMTIiIHdpZHRoPSIyOCIgaGVpZ2h0PSI0MCIgZmlsbD0iIzAwNDQwMCIvPjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjMDAxMTAwIi8+PHJlY3QgeD0iMjQiIHk9IjI2IiB3aWR0aD0iNCIgaGVpZ2h0PSIyIiBmaWxsPSIjNjZmZjY2Ii8+PHJlY3QgeD0iMzYiIHk9IjI2IiB3aWR0aD0iNCIgaGVpZ2h0PSIyIiBmaWxsPSIjNjZmZjY2Ii8+PHJlY3QgeD0iMzAiIHk9IjgiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuOCIvPjxyZWN0IHg9IjI4IiB5PSIzNCIgd2lkdGg9IjgiIGhlaWdodD0iMiIgZmlsbD0iIzAwNjYwMCIvPjwvc3ZnPg==";
const AVATAR_BARBARIAN = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiMwMDAwMDAiLz48cmVjdCB4PSIxNiIgeT0iMTYiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0iIzAwMzMwMCIvPjxyZWN0IHg9IjE0IiB5PSI4IiB3aWR0aD0iMzYiIGhlaWdodD0iMTIiIGZpbGw9IiMwMDU1MDAiLz48cmVjdCB4PSIxMiIgeT0iMTIiIHdpZHRoPSI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjMDA1NTAwIi8+PHJlY3QgeD0iNDgiIHk9IjEyIiB3aWR0aD0iNCIgaGVpZ2h0PSIyNCIgZmlsbD0iIzAwNTUwMCIvPjxyZWN0IHg9IjIyIiB5PSIyNCIgd2lkdGg9IjYiIGhlaWdodD0iNCIgZmlsbD0iIzAwMDAwMCIvPjxyZWN0IHg9IjM2IiB5PSIyNCIgd2lkdGg9IjYiIGhlaWdodD0iNCIgZmlsbD0iIzAwMDAwMCIvPjxyZWN0IHg9IjIzIiB5PSIyNCIgd2lkdGg9IjIiIGhlaWdodD0iMiIgZmlsbD0iI2ZmZmZmZiIvPjxyZWN0IHg9IjM3IiB5PSIyNCIgd2lkdGg9IjIiIGhlaWdodD0iMiIgZmlsbD0iI2ZmZmZmZiIvPjxyZWN0IHg9IjIyIiB5PSIzMCIgd2lkdGg9IjQiIGhlaWdodD0iMiIgZmlsbD0iIzAwNTUwMCIvPjxyZWN0IHg9IjM4IiB5PSIzMCIgd2lkdGg9IjQiIGhlaWdodD0iMiIgZmlsbD0iIzAwNTUwMCIvPjxyZWN0IHg9IjMwIiB5PSIzOCIgd2lkdGg9IjQiIGhlaWdodD0iMiIgZmlsbD0iIzAwMDAwMCIvPjwvc3ZnPg==";
const AVATAR_ARCHER = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj4KICA8IS0tIEJhY2tncm91bmQgLS0+CiAgPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjMDAwMDAwIi8+CiAgPCEtLSBHcmVlbiBIb29kL0Nsb2FrIC0tPgogIDxyZWN0IHg9IjE2IiB5PSIxMiIgd2lkdGg9IjMyIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMDA0NDAwIi8+CiAgPHJlY3QgeD0iMjAiIHk9IjgiIHdpZHRoPSIyNCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDA0NDAwIi8+CiAgPCEtLSBGYWNlIFNoYWRvdyAtLT4KICA8cmVjdCB4PSIyMCIgeT0iMjAiIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0iIzAwMjIwMCIvPgogIDwhLS0gRXllcyAoV2hpdGUgZm9yIGJsaW5raW5nKSAtLT4KICA8cmVjdCB4PSIyNCIgeT0iMjYiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmZmZmYiLz4KICA8cmVjdCB4PSIzNCIgeT0iMjYiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmZmZmYiLz4KICA8IS0tIEJvdyAtLT4KICA8cmVjdCB4PSIxMiIgeT0iMTYiIHdpZHRoPSI0IiBoZWlnaHQ9IjMyIiBmaWxsPSIjOEI0NTEzIi8+CiAgPHJlY3QgeD0iMTQiIHk9IjE0IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjOEI0NTEzIi8+CiAgPHJlY3QgeD0iMTQiIHk9IjQ2IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjOEI0NTEzIi8+CiAgPCEtLSBTdHJpbmcgLS0+CiAgPHJlY3QgeD0iMTQiIHk9IjE4IiB3aWR0aD0iMSIgaGVpZ2h0PSIyOCIgZmlsbD0iI0FBQUFBQSIgb3BhY2l0eT0iMC41Ii8+Cjwvc3ZnPg==";
const AVATAR_ROGUE = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiMwMDAwMDAiLz48cmVjdCB4PSIxOCIgeT0iMTIiIHdpZHRoPSIyOCIgaGVpZ2h0PSIzNiIgZmlsbD0iIzAwMzMwMCIvPjxyZWN0IHg9IjIwIiB5PSIyNCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjYiIGZpbGw9IiMwMDU1MDAiLz48cmVjdCB4PSIzNCIgeT0iMjQiIHdpZHRoPSIxMCIgaGVpZ2h0PSI2IiBmaWxsPSIjMDA1NTAwIi8+PHJlY3QgeD0iMjIiIHk9IjI1IiB3aWR0aD0iNiIgaGVpZ2h0PSI0IiBmaWxsPSIjZmYwMDAwIiAvPjxyZWN0IHg9IjM2IiB5PSIyNCIgd2lkdGg9IjYiIGhlaWdodD0iNCIgZmlsbD0iI2ZmMDAwMCIgLz48cmVjdCB4PSIxOCIgeT0iMzQiIHdpZHRoPSIyOCIgaGVpZ2h0PSIxNCIgZmlsbD0iIzAwMjIwMCIvPjxyZWN0IHg9IjMwIiB5PSIzNiIgd2lkdGg9IjQiIGhlaWdodD0iMiIgZmlsbD0iIzAwMTEwMCIgb3BhY2l0eT0iMC4zIi8+PC9zdmc+";

// --- ENEMIES ---

export const AVATAR_RAT = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48IS0tIEJvZHkgLS0+PHJlY3QgeD0iMTYiIHk9IjMyIiB3aWR0aD0iMzIiIGhlaWdodD0iMTYiIGZpbGw9IiM2NjY2NjYiLz48IS0tIEhlYWQgLS0+PHJlY3QgeD0iNDQiIHk9IjM2IiB3aWR0aD0iMTIiIGhlaWdodD0iOCIgZmlsbD0iIzY2NjY2NiIvPjwhLS0gRWFycyAtLT48cmVjdCB4PSI0OCIgeT0iMzIiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiM4ODg4ODgiLz48IS0tIEV5ZXMgLS0+PHJlY3QgeD0iNTIiIHk9IjM4IiB3aWR0aD0iMiIgaGVpZ2h0PSIyIiBmaWxsPSIjZmYwMDAwIi8+PCEtLSBUYWlsIC0tPjxyZWN0IHg9IjQiIHk9IjM4IiB3aWR0aD0iMTIiIGhlaWdodD0iMiIgZmlsbD0iI2ZmYWFhYSIvPjxyZWN0IHg9IjIiIHk9IjM2IiB3aWR0aD0iMiIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZhYWFhIi8+PCEtLSBMZWdzIC0tPjxyZWN0IHg9IjIwIiB5PSI0OCIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iIzQ0NDQ0NCIvPjxyZWN0IHg9IjQwIiB5PSI0OCIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iIzQ0NDQ0NCIvPjwvc3ZnPg==";
export const AVATAR_BAT = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48IS0tIFdpbmdzIChEYXJrIFB1cnBsZSkgLS0+PHJlY3QgeD0iMiIgeT0iMjQiIHdpZHRoPSI2MCIgaGVpZ2h0PSIxNiIgZmlsbD0iIzJiMTA0NCIvPjxyZWN0IHg9IjQiIHk9IjIwIiB3aWR0aD0iNTYiIGhlaWdodD0iNCIgZmlsbD0iIzJiMTA0NCIvPjwhLS0gQm9keSAoUHVycGxlKSAtLT48cmVjdCB4PSIyMiIgeT0iMjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iIzZmMzI5OSIvPjwhLS0gRWFycyAtLT48cmVjdCB4PSIyMiIgeT0iMTAiIHdpZHRoPSI2IiBoZWlnaHQ9IjEwIiBmaWxsPSIjNmYzMjk5Ii8+PHJlY3QgeD0iMzYiIHk9IjEwIiB3aWR0aD0iNiIgaGVpZ2h0PSIxMCIgZmlsbD0iIzZmMzI5OSIvPjwhLS0gRXllcyAoUmVkIGZvciBibGlua2luZykgLS0+PHJlY3QgeD0iMjYiIHk9IjI2IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmYwMDAwIi8+PHJlY3QgeD0iMzQiIHk9IjI2IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmYwMDAwIi8+PCEtLSBGYW5ncyAtLT48cmVjdCB4PSIyOSIgeT0iMzQiIHdpZHRoPSIyIiBoZWlnaHQ9IjMiIGZpbGw9IiNmZmYiLz48cmVjdCB4PSIzMyIgeT0iMzQiIHdpZHRoPSIyIiBoZWlnaHQ9IjMiIGZpbGw9IiNmZmYiLz48L3N2Zz4=";
export const AVATAR_GOBLIN = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48IS0tIEhlYWQgLS0+PHJlY3QgeD0iMjAiIHk9IjE2IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IiMwMDgwMDAiLz48IS0tIEVhcnMgLS0+PHJlY3QgeD0iMTIiIHk9IjIwIiB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDA4MDAwIi8+PHJlY3QgeD0iNDQiIHk9IjIwIiB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDA4MDAwIi8+PCEtLSBFeWVzIC0tPjxyZWN0IHg9IjI0IiB5PSIyNCIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iI2ZmZmIwMCIvPjxyZWN0IHg9IjM2IiB5PSIyNCIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iI2ZmZmIwMCIvPjwhLS0gTW91dGggLS0+PHJlY3QgeD0iMjgiIHk9IjMyIiB3aWR0aD0iOCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwMDAwIi8+PCEtLSBUZWV0aCAtLT48cmVjdCB4PSIyOCIgeT0iMzYiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiNmZmZmZmYiLz48cmVjdCB4PSIzNCIgeT0iMzYiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiNmZmZmZmYiLz48IS0tIEJvZHkgLS0+PHJlY3QgeD0iMjIiIHk9IjQwIiB3aWR0aD0iMjAiIGhlaWdodD0iMTYiIGZpbGw9IiM2YjU1NDMiLz48IS0tIEFybXMgLS0+PHJlY3QgeD0iMTYiIHk9IjQyIiB3aWR0aD0iNiIgaGVpZ2h0PSIxMiIgZmlsbD0iIzAwODAwMCIvPjxyZWN0IHg9IjQyIiB5PSI0MiIgd2lkdGg9IjYiIGhlaWdodD0iMTIiIGZpbGw9IiMwMDgwMDAiLz48L3N2Zz4=";
export const AVATAR_SKELETON = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48IS0tIFNrdWxsIEJhc2UgLS0+PHJlY3QgeD0iMjIiIHk9IjEwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9IiNjY2NjY2MiLz48cmVjdCB4PSIyNCIgeT0iMzAiIHdpZHRoPSIxNiIgaGVpZ2h0PSI0IiBmaWxsPSIjY2NjY2NjIi8+PCEtLSBKYXcgLS0+PHJlY3QgeD0iMjAiIHk9IjE0IiB3aWR0aD0iMiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2JiYmJiYiIvPjwhLS0gc2lkZSBzaGFkb3cgLS0+PHJlY3QgeD0iNDIiIHk9IjE0IiB3aWR0aD0iMiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2JiYmJiYiIvPjwhLS0gc2lkZSBzaGFkb3cgLS0+PCEtLSBFeWUgU29ja2V0cyAtLT48cmVjdCB4PSIyNiIgeT0iMTYiIHdpZHRoPSI2IiBoZWlnaHQ9IjgiIGZpbGw9IiMxMTExMTEiLz48cmVjdCB4PSIzMiIgeT0iMTYiIHdpZHRoPSI2IiBoZWlnaHQ9IjgiIGZpbGw9IiMxMTExMTEiLz48IS0tIEdsb3dpbmcgUHVwaWxzIC0tPjxyZWN0IHg9IjI4IiB5PSIxOSIgd2lkdGg9IjIiIGhlaWdodD0iMiIgZmlsbD0iIzAwZmZhYSIvPjxyZWN0IHg9IjM0IiB5PSIxOSIgd2lkdGg9IjIiIGhlaWdodD0iMiIgZmlsbD0iIzAwZmZhYSIvPjwhLS0gTm9zZSBTb2NrZXQgLS0+PHJlY3QgeD0iMzAiIHk9IjI0IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMTExMTExIi8+PCEtLSBUZWV0aCAtLT48cmVjdCB4PSIyNiIgeT0iMzAiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiNhYWFhYWEiLz48cmVjdCB4PSIyOCIgeT0iMzAiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiNkZGRkZGQiLz48cmVjdCB4PSIzMCIgeT0iMzAiIHdpZHRoPSI0IiBoZWlnaHQ9IjIiIGZpbGw9IiNhYWFhYWEiLz48cmVjdCB4PSIzNCIgeT0iMzAiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiNkZGRkZGQiLz48cmVjdCB4PSIzNiIgeT0iMzAiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiNhYWFhYWEiLz48IS0tIFRvcnNvICYgUmlicyAtLT48cmVjdCB4PSIzMCIgeT0iMzQiIHdpZHRoPSI0IiBoZWlnaHQ9IjE4IiBmaWxsPSIjYmJiYmJiIi8+PCEtLSBTcGluZSAtLT48cmVjdCB4PSIyMiIgeT0iMzYiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyIiBmaWxsPSIjY2NjY2NjIi8+PCEtLSBSaWIgMSAtLT48cmVjdCB4PSIyMiIgeT0iNDAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyIiBmaWxsPSIjY2NjY2NjIi8+PCEtLSBSaWIgMiAtLT48cmVjdCB4PSIyNCIgeT0iNDQiIHdpZHRoPSIxNiIgaGVpZ2h0PSIyIiBmaWxsPSIjY2NjY2NjIi8+PCEtLSBSaWIgMyAtLT48IS0tIFNob3VsZGVycyAtLT48cmVjdCB4PSIxOCIgeT0iMzQiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNiYmJiYmIiLz48cmVjdCB4PSI0MiIgeT0iMzQiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNiYmJiYmIiLz48IS0tIFRhdHRlcmVkIFBhdWxkcm9uIC0tPjxyZWN0IHg9IjQwIiB5PSIzMiIgd2lkdGg9IjgiIGhlaWdodD0iOCIgZmlsbD0iIzMzMjIxMSIvPjxyZWN0IHg9IjQyIiB5PSI0MCIgd2lkdGg9IjQiIGhlaWdodD0iMiIgZmlsbD0iIzMzMjIxMSIvPjxyZWN0IHg9IjQ2IiB5PSIzNCIgd2lkdGg9IjIiIGhlaWdodD0iNCIgZmlsbD0iIzIyMTEwMCIvPjwvc3ZnPg==";
export const AVATAR_SLIME = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48IS0tIE1haW4gQmxvYiAtLT48cmVjdCB4PSIxNiIgeT0iMjgiIHdpZHRoPSIzMiIgaGVpZ2h0PSIyOCIgZmlsbD0iIzAwZmYwMCIgb3BhY2l0eT0iMC42Ii8+PHJlY3QgeD0iMjAiIHk9IjIwIiB3aWR0aD0iMjQiIGhlaWdodD0iOCIgZmlsbD0iIzAwZmYwMCIgb3BhY2l0eT0iMC42Ii8+PCEtLSBDb3JlIC0tPjxyZWN0IHg9IjI0IiB5PSIzMiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjMDA2NjAwIi8+PCEtLSBXZXQgU3BvdHMgLS0+PHJlY3QgeD0iMjIiIHk9IjI0IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjUiLz48cmVjdCB4PSIzOCIgeT0iMzYiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuNSIvPjwhLS0gR2xpdGNoIENpcmN1aXRzIC0tPjxyZWN0IHg9IjI2IiB5PSIzNCIgd2lkdGg9IjgiIGhlaWdodD0iMiIgZmlsbD0iIzAwZmZmZiIvPjxyZWN0IHg9IjI2IiB5PSI0MCIgd2lkdGg9IjEiIGhlaWdodD0iNCIgZmlsbD0iIzAwZmZmZiIvPjxyZWN0IHg9IjMyIiB5PSI0MCIgd2lkdGg9IjEiIGhlaWdodD0iNCIgZmlsbD0iIzAwZmZmZiIvPjxyZWN0IHg9IjE4IiB5PSI0OCIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iIzMzZmYzMyIvPjxyZWN0IHg9IjQyIiB5PSI0OCIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iIzMzZmYzMyIvPjwvc3ZnPg==";

export const SPRITE_CHEST = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+PHJlY3QgeD0iOCIgeT0iMjQiIHdpZHRoPSI0OCIgaGVpZ2h0PSIzMiIgZmlsbD0iIzhCNDQxMyIvPjxyZWN0IHg9IjgiIHk9IjE2IiB3aWR0aD0iNDgiIGhlaWdodD0iOCIgZmlsbD0iI0EwNTIyRCIvPjxyZWN0IHg9IjI4IiB5PSIyNCIgd2lkdGg9IjgiIGhlaWdodD0iOCIgZmlsbD0iI0ZGRDcwMCIvPjwvc3ZnPg==";
export const SPRITE_STAIRS = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+PHBhdGggZD0iTTAgNjRIMjBWMzJINDBWMThINjBWMEg2NFY2NEgweiIgZmlsbD0iIzU1NSIvPjwvc3ZnPg==";
export const SPRITE_STAIRS_UP = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+PHBhdGggZD0iTTAgNjRIMjBWMzJINDBWMThINjBWMEg2NFY2NEgweiIgZmlsbD0iIzg4OCIvPjwvc3ZnPg==";

export const ITEMS: Item[] = [
    { id: 'pot_hp_s', name: 'Minor Potion', type: 'consumable', value: 10, stat: 30, description: 'Restores 30 HP' },
    { id: 'pot_mp_s', name: 'Minor Ether', type: 'consumable', value: 15, magicStat: 15, description: 'Restores 15 MP' },
    { id: 'sword_iron', name: 'Iron Sword', type: 'weapon', weight: 'MEDIUM', value: 50, stat: 10, description: 'Standard infantry weapon.' },
    { id: 'axe_battle', name: 'Battle Axe', type: 'weapon', weight: 'HEAVY', value: 70, stat: 18, description: 'Heavy and deadly.' },
    { id: 'staff_wood', name: 'Oak Staff', type: 'weapon', weight: 'LIGHT', value: 40, stat: 4, magicStat: 12, description: 'Focuses magical energy.' },
    { id: 'dagger_steel', name: 'Steel Dagger', type: 'weapon', weight: 'LIGHT', value: 45, stat: 8, description: 'Fast and sharp.' },
    { id: 'armor_leather', name: 'Leather Armor', type: 'chest', weight: 'LIGHT', value: 40, stat: 5, description: 'Provides basic protection.' },
    { id: 'armor_chain', name: 'Chainmail', type: 'chest', weight: 'MEDIUM', value: 80, stat: 12, description: 'Interlocking metal rings.' },
    { id: 'armor_plate', name: 'Plate Armor', type: 'chest', weight: 'HEAVY', value: 150, stat: 20, description: 'Solid metal plates.' },
    { id: 'helm_leather', name: 'Leather Cap', type: 'helm', weight: 'LIGHT', value: 20, stat: 2, description: 'Keeps the rain off.' },
    { id: 'helm_iron', name: 'Iron Helm', type: 'helm', weight: 'HEAVY', value: 60, stat: 8, description: 'Protects the noggin.' },
];

export const MATERIALS: Item[] = [
    { id: 'mat_scrap', name: 'Scrap Metal', type: 'material', value: 5, description: 'Rusted bits.' },
    { id: 'mat_herb', name: 'Green Herb', type: 'material', value: 8, description: 'Medicinal plant.' },
    { id: 'mat_essence', name: 'Magic Essence', type: 'material', value: 25, description: 'Glowing dust.' },
];

export const ENEMIES: Enemy[] = [
    { id: 'rat', name: 'Giant Rat', instanceId: '', hp: 30, maxHp: 30, mp: 0, maxMp: 0, level: 1, str: 5, int: 1, dex: 8, vit: 4, cha: 1, buffs: [], xpValue: 10, goldValue: 5, color: '#aaa', seed: 1, prompt: 'rat', avatar: AVATAR_RAT },
    { id: 'bat', name: 'Vampire Bat', instanceId: '', hp: 25, maxHp: 25, mp: 0, maxMp: 0, level: 1, str: 4, int: 2, dex: 12, vit: 3, cha: 1, buffs: [], xpValue: 12, goldValue: 8, color: '#333', seed: 2, prompt: 'bat', avatar: AVATAR_BAT },
    { id: 'goblin', name: 'Goblin', instanceId: '', hp: 45, maxHp: 45, mp: 10, maxMp: 10, level: 2, str: 8, int: 3, dex: 9, vit: 6, cha: 2, buffs: [], xpValue: 25, goldValue: 15, color: '#3a3', seed: 3, prompt: 'goblin', avatar: AVATAR_GOBLIN },
    { id: 'skel', name: 'Skeleton', instanceId: '', hp: 60, maxHp: 60, mp: 0, maxMp: 0, level: 2, str: 10, int: 1, dex: 6, vit: 10, cha: 1, buffs: [], xpValue: 30, goldValue: 20, color: '#eee', seed: 4, prompt: 'skeleton', avatar: AVATAR_SKELETON },
    { id: 'slime', name: 'Green Slime', instanceId: '', hp: 100, maxHp: 100, mp: 0, maxMp: 0, level: 3, str: 12, int: 1, dex: 2, vit: 15, cha: 1, buffs: [], xpValue: 40, goldValue: 25, color: '#0f0', seed: 5, prompt: 'slime', avatar: AVATAR_SLIME },
];

const SKILLS: Skill[] = [
    { id: 'w_bash', name: 'Bash', desc: 'Heavy strike, chance to stun', cost: 8, type: 'attack', targetType: 'enemy', minLevel: 1, basePower: 1.2 },
    { id: 'w_wall', name: 'Shield Wall', desc: 'Buffs DEF', cost: 12, type: 'buff', targetType: 'ally', minLevel: 2 },
    { id: 'w_cry', name: 'War Cry', desc: 'Buffs ATK', cost: 15, type: 'buff', targetType: 'ally', minLevel: 3 },
    { id: 'm_fire', name: 'Fireball', desc: 'Magical fire damage', cost: 10, type: 'special', targetType: 'enemy', minLevel: 1, basePower: 1.5 },
    { id: 'm_shield', name: 'Mana Shield', desc: 'Buffs M.DEF', cost: 12, type: 'buff', targetType: 'ally', minLevel: 2 },
    { id: 'm_solar', name: 'Solar Flare', desc: 'AoE Fire damage', cost: 25, type: 'special', targetType: 'enemy', minLevel: 5, isAoe: true, basePower: 1.2 },
    { id: 'c_heal', name: 'Heal', desc: 'Restores HP', cost: 8, type: 'heal', targetType: 'ally', minLevel: 1, basePower: 2.0 },
    { id: 'c_bless', name: 'Bless', desc: 'Buffs STR', cost: 10, type: 'buff', targetType: 'ally', minLevel: 2 },
    { id: 'c_revive', name: 'Revive', desc: 'Revives fallen ally', cost: 30, type: 'heal', targetType: 'ally', minLevel: 5, revive: true },
    { id: 'r_stab', name: 'Backstab', desc: 'High crit chance', cost: 10, type: 'attack', targetType: 'enemy', minLevel: 1, basePower: 1.3 },
    { id: 'r_pois', name: 'Poison Edge', desc: 'Inflicts poison', cost: 12, type: 'attack', targetType: 'enemy', minLevel: 2, basePower: 1.0 },
    { id: 'r_mug', name: 'Mug', desc: 'Steal item/gold', cost: 5, type: 'attack', targetType: 'enemy', minLevel: 3, basePower: 0.8 },
    { id: 'b_blood', name: 'Bloodlust', desc: 'Attack converts to HP', cost: 15, type: 'attack', targetType: 'enemy', minLevel: 1, basePower: 1.2 },
    { id: 'b_shout', name: 'Terrify', desc: 'AoE Stun', cost: 20, type: 'special', targetType: 'enemy', minLevel: 3, isAoe: true, basePower: 0 },
    { id: 'a_shot', name: 'Power Shot', desc: 'High damage shot', cost: 8, type: 'attack', targetType: 'enemy', minLevel: 1, basePower: 1.4 },
    { id: 'a_eye', name: 'Eagle Eye', desc: 'Buffs Crit', cost: 12, type: 'buff', targetType: 'self', minLevel: 2 },
];

export const CLASSES: ClassDefinition[] = [
    { type: 'WARRIOR', avatar: AVATAR_WARRIOR, description: 'Melee fighter, high defense.', hp: 120, mp: 30, str: 10, int: 3, dex: 6, vit: 10, cha: 5, skillPool: SKILLS.filter(s => s.id.startsWith('w_')), starterSkillIds: ['w_bash'] },
    { type: 'MAGE', avatar: AVATAR_MAGE, description: 'Spellcaster, high damage.', hp: 70, mp: 100, str: 3, int: 12, dex: 6, vit: 4, cha: 6, skillPool: SKILLS.filter(s => s.id.startsWith('m_')), starterSkillIds: ['m_fire'] },
    { type: 'CLERIC', avatar: AVATAR_CLERIC, description: 'Healer, support.', hp: 90, mp: 80, str: 6, int: 10, dex: 5, vit: 6, cha: 8, skillPool: SKILLS.filter(s => s.id.startsWith('c_')), starterSkillIds: ['c_heal'] },
    { type: 'ROGUE', avatar: AVATAR_ROGUE, description: 'Stealth, high crit.', hp: 85, mp: 40, str: 7, int: 4, dex: 12, vit: 5, cha: 4, skillPool: SKILLS.filter(s => s.id.startsWith('r_')), starterSkillIds: ['r_stab'] },
    { type: 'BARBARIAN', avatar: AVATAR_BARBARIAN, description: 'High HP, rage.', hp: 140, mp: 10, str: 12, int: 1, dex: 5, vit: 12, cha: 2, skillPool: SKILLS.filter(s => s.id.startsWith('b_')), starterSkillIds: ['b_blood'] },
    { type: 'ARCHER', avatar: AVATAR_ARCHER, description: 'Ranged damage.', hp: 80, mp: 40, str: 6, int: 3, dex: 14, vit: 5, cha: 5, skillPool: SKILLS.filter(s => s.id.startsWith('a_')), starterSkillIds: ['a_shot'] },
];

export const MOD_POOL: ItemMod[] = [
    { stat: 'str', value: 3, name: 'of Might' },
    { stat: 'int', value: 3, name: 'of Mind' },
    { stat: 'dex', value: 3, name: 'of Speed' },
    { stat: 'vit', value: 3, name: 'of Vitality' },
    { stat: 'atk', value: 5, name: 'Sharp' },
    { stat: 'def', value: 5, name: 'Sturdy' },
];

export const CLASS_APTITUDES: Record<string, Record<string, number>> = {
    'WARRIOR': { 'HEAVY': 1.2, 'MEDIUM': 1.0, 'LIGHT': 0.8 },
    'MAGE': { 'HEAVY': 0.5, 'MEDIUM': 0.8, 'LIGHT': 1.2 },
    'CLERIC': { 'HEAVY': 1.0, 'MEDIUM': 1.0, 'LIGHT': 1.0 },
    'ROGUE': { 'HEAVY': 0.5, 'MEDIUM': 1.0, 'LIGHT': 1.2 },
    'BARBARIAN': { 'HEAVY': 1.0, 'MEDIUM': 1.1, 'LIGHT': 1.0 },
    'ARCHER': { 'HEAVY': 0.6, 'MEDIUM': 1.1, 'LIGHT': 1.1 },
};

export const generateTownMap = (): number[][] => {
    // 12x12 Town (More compact)
    const map = Array(12).fill(0).map(() => Array(12).fill(0));
    
    // Outer Walls
    for(let y=0; y<12; y++) {
        for(let x=0; x<12; x++) {
            if (x===0 || x===11 || y===0 || y===11) map[y][x] = 1;
        }
    }

    // House 1 (The Inn) - Top Left
    // 4x4 Box from (1,1) to (4,4)
    for(let y=1; y<=4; y++) {
        for(let x=1; x<=4; x++) {
            if (y===1 || y===4 || x===1 || x===4) map[y][x] = 1;
        }
    }
    map[3][3] = 0; // Empty inside
    map[4][2] = 10; // Door Facing South (At y=4)

    // House 2 (Elder's Home) - Bottom Right
    // 4x4 Box from (7,7) to (10,10)
    for(let y=7; y<=10; y++) {
        for(let x=7; x<=10; x++) {
            if (y===7 || y===10 || x===7 || x===10) map[y][x] = 1;
        }
    }
    map[8][8] = 0; // Empty inside
    map[7][9] = 10; // Door Facing North (At y=7)

    // Features
    map[1][6] = 3; // Dungeon Stairs (North Wall Center)
    map[6][6] = 7; // Fountain (Center)
    map[3][9] = 5; // Merchant (East side)

    return map;
};

export const INTERIOR_MAPS: Record<number, { map: number[][], entryPos: Position }> = {
    [-2]: { // House 1 (Inn)
        map: [
            [1,1,1,1,1],
            [1,0,6,0,1], // Traveler
            [1,0,0,0,1],
            [1,0,0,0,1],
            [1,1,10,1,1] // Door South
        ],
        entryPos: {x: 2, y: 3}
    },
    [-3]: { // House 2 (Elder)
        map: [
            [1,1,1,1,1],
            [1,0,8,0,1], // Villager
            [1,0,0,0,1],
            [1,0,0,0,1],
            [1,1,10,1,1] // Door South
        ],
        entryPos: {x: 2, y: 3}
    }
};

export const DOOR_LOCATIONS: Record<string, number> = {
    "2,4": -2,   // Town coords -> Inn (x=2, y=4)
    "9,7": -3    // Town coords -> Elder (x=9, y=7)
};

export const generateDungeon = (): { floors: number[][][], stairsDownLocations: Record<number, Position> } => {
    const floors: number[][][] = [];
    const stairsDownLocations: Record<number, Position> = {};
    const floorCount = 5;
    const size = DUNGEON_SIZE;

    for (let f = 0; f < floorCount; f++) {
        const floorMap = Array(size).fill(0).map(() => Array(size).fill(1));
        
        let x = Math.floor(size/2);
        let y = Math.floor(size/2);
        let steps = 400;
        
        if (f===0) { floorMap[1][1] = 0; x=1; y=1; }
        
        while(steps > 0) {
            floorMap[y][x] = 0;
            const dir = Math.floor(Math.random() * 4);
            if (dir === 0 && y > 1) y--;
            else if (dir === 1 && x < size-2) x++;
            else if (dir === 2 && y < size-2) y++;
            else if (dir === 3 && x > 1) x--;
            steps--;
        }

        // Place stairs down
        let sx, sy;
        do {
            sx = Math.floor(Math.random() * (size-2)) + 1;
            sy = Math.floor(Math.random() * (size-2)) + 1;
        } while (floorMap[sy][sx] !== 0);
        
        if (f < floorCount - 1) {
            floorMap[sy][sx] = 3;
            stairsDownLocations[f] = {x: sx, y: sy};
        }

        // --- SECRET WALL GENERATION ---
        let numSecretWalls = 1;
        if (Math.random() < 0.30) {
            numSecretWalls += 1 + Math.floor(Math.random() * 3);
        }

        const candidates: { wx: number, wy: number, rx: number, ry: number }[] = [];
        for (let y_ = 1; y_ < size - 2; y_++) {
            for (let x_ = 1; x_ < size - 2; x_++) {
                // Horizontal: Floor - Wall - Wall
                if (floorMap[y_][x_] === 0 && floorMap[y_][x_ + 1] === 1 && floorMap[y_][x_ + 2] === 1) {
                    candidates.push({ wx: x_ + 1, wy: y_, rx: x_ + 2, ry: y_ });
                }
                // Vertical: Floor - Wall - Wall
                if (floorMap[y_][x_] === 0 && floorMap[y_ + 1][x_] === 1 && floorMap[y_ + 2][x_] === 1) {
                    candidates.push({ wx: x_, wy: y_ + 1, rx: x_, ry: y_ + 2 });
                }
            }
        }
        // Shuffle candidates
        for (let i = candidates.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
        }
        // Place secret walls from shuffled candidates
        for (let i = 0; i < Math.min(numSecretWalls, candidates.length); i++) {
            const spot = candidates[i];
            floorMap[spot.wy][spot.wx] = 9; // Secret Wall
            floorMap[spot.ry][spot.rx] = Math.random() < 0.7 ? 4 : 12; // 70% Chest, 30% Lore NPC
        }
        // --- END SECRET WALLS ---

        floors.push(floorMap);
    }
    
    // Ensure Stairs UP exist on Floor 0 (leading to town)
    if (floors[0]) floors[0][1][1] = 11;

    // Link stairs up/down
    for(let f=1; f<floorCount; f++) {
        const prev = stairsDownLocations[f-1];
        if (prev && floors[f]) {
            floors[f][prev.y][prev.x] = 11;
        }
    }

    return { floors, stairsDownLocations };
};
