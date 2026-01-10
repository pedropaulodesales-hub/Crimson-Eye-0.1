import { Item, Enemy, Skill, PlayerClass, ItemMod, ClassDefinition, EquipmentWeight, Position } from './types';

export const DUNGEON_SIZE = 20;

export const MERCHANT_AVATAR = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48IS0tIEhvb2QgLS0+PHJlY3QgeD0iMTYiIHk9IjgiIHdpZHRoPSIzMiIgaGVpZ2h0PSI0OCIgZmlsbD0iIzAwMTMwMCIvPjxyZWN0IHg9IjIwIiB5PSI0IiB3aWR0aD0iMjQiIGhlaWdodD0iNTIiIGZpbGw9IiMwMDEzMDAiLz48IS0tIEZhY2UgQmFzZSAtLT48cmVjdCB4PSIyNCIgeT0iMTYiIHdpZHRoPSIxNiIgaGVpZ2h0PSIyNCIgZmlsbD0iIzAwMzMwMCIvPjxyZWN0IHg9IjI2IiB5PSIxNCIgd2lkdGg9IjEyIiBoZWlnaHQ9IjIiIGZpbGw9IiMwMDMzMDAiLz48IS0tIENoZWVrYm9uZXMgJiBGb3JlaGVhZCAtLT48cmVjdCB4PSIyOCIgeT0iMTYiIHdpZHRoPSI4IiBoZWlnaHQ9IjIwIiBmaWxsPSIjMDA0NDAwIi8+PHJlY3QgeD0iMjYiIHk9IjIwIiB3aWR0aD0iMTIiIGhlaWdodD0iNCIgZmlsbD0iIzAwNDQwMCIvPjwhLS0gRXllcyAtLT48cmVjdCB4PSIyNyIgeT0iMjQiIHdpZHRoPSI0IiBoZWlnaHQ9IjIiIGZpbGw9IiMwMDExMDAiLz48cmVjdCB4PSIzMyIgeT0iMjQiIHdpZHRoPSI0IiBoZWlnaHQ9IjIiIGZpbGw9IiMwMDExMDAiLz48IS0tIEdsb3dpbmcgUHVwaWxzIC0tPjxyZWN0IHg9IjI4IiB5PSIyNCIgd2lkdGg9IjIiIGhlaWdodD0iMiIgZmlsbD0iIzMzZmYzMyIvPjxyZWN0IHg9IjM0IiB5PSIyNCIgd2lkdGg9IjIiIGhlaWdodD0iMiIgZmlsbD0iIzMzZmYzMyIvPjxyZWN0IHg9IjI5IiB5PSIyNCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iI2ZmZmZmZiIvPjxyZWN0IHg9IjM1IiB5PSIyNCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iI2ZmZmZmZiIvPjwhLS0gTm9zZSAtLT48cmVjdCB4PSIzMSIgeT0iMjgiIHdpZHRoPSIyIiBoZWlnaHQ9IjMiIGZpbGw9IiMwMDIyMDAiLz48IS0tIE1vdXRoIC8gQ2hpbiAtLT48cmVjdCB4PSIzMCIgeT0iMzYiIHdpZHRoPSI0IiBoZWlnaHQ9IjIiIGZpbGw9IiMwMDExMDAiLz48cmVjdCB4PSIyOCIgeT0iMzgiIHdpZHRoPSI4IiBoZWlnaHQ9IjIiIGZpbGw9IiMwMDIyMDAiLz48IS0tIERpZ2l0YWwgQmVhcmQgLS0+PHJlY3QgeD0iMjYiIHk9IjQwIiB3aWR0aD0iMTIiIGhlaWdodD0iNCIgZmlsbD0iIzAwNjYwMCIgb3BhY2l0eT0iMC42Ii8+PHJlY3QgeD0iMjQiIHk9IjQ0IiB3aWR0aD0iMTYiIGhlaWdodD0iMiIgZmlsbD0iIzAwNjYwMCIgb3BhY2l0eT0iMC4zIi8+PC9zdmc+";

export const AVATAR_TRAVELER = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48IS0tIENsb2FrIC0tPjxyZWN0IHg9IjE6IiB5PSI4IiB3aWR0aD0iMzIiIGhlaWdodD0iNDgiIGZpbGw9IiM1YzQwMzMiLz48cmVjdCB4PSIyMCIgeT0iNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjUyIiBmaWxsPSIjNWM0MDMzIi8+PCEtLSBEYXJrIEludGVyaW9yIC0tPjxyZWN0IHg9IjI0IiB5PSIxNiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjMmUyZTMzIi8+PCEtLSBFeWVzIChIaWRkZW4gaW4gc2hhZG93KSAtLT48cmVjdCB4PSIyNiIgeT0iMjAiIHdpZHRoPSI0IiBoZWlnaHQ9IjIiIGZpbGw9IiNhYWZmYWEiIG9wYWNpdHk9IjAuNiIvPjxyZWN0IHg9IjM0IiB5PSIyMCIgd2lkdGg9IjQiIGhlaWdodD0iMiIgZmlsbD0iI2FhZmZhYSIgb3BhY2l0eT0iMC42Ii8+PCEtLSBTY2FyZiAtLT48cmVjdCB4PSIyMiIgeT0iMzIiIHdpZHRoPSIyMCIgaGVpZ2h0PSI4IiBmaWxsPSIjOGI0NTEzIi8+PCEtLSBCcm9vY2ggLS0+PHJlY3QgeD0iMzAiIHk9IjM0IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZkNTAwIi8+PC9zdmc+";

export const SPRITE_CHEST = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48IS0tIFNoYWRvdyAtLT48cmVjdCB4PSI4IiB5PSI0OCIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjgiIGZpbGw9IiMwMDAwMDAiIG9wYWNpdHk9IjAuNSIvPjwhLS0gQm9keSAtLT48cmVjdCB4PSIxMiIgeT0iMjgiIHdpZHRoPSI0MCIgaGVpZ2h0PSIyNCIgZmlsbD0iIzViMzYxMiIvPjwhLS0gTGlkIC0tPjxyZWN0IHg9IjEwIiB5PSIxNiIgd2lkdGg9IjQ0IiBoZWlnaHQ9IjEyIiBmaWxsPSIjN2M0YTE5Ii8+PCEtLSBHb2xkIEJhbmRzIC0tPjxyZWN0IHg9IjE0IiB5PSIyOCIgd2lkdGg9IjQiIGhlaWdodD0iMjQiIGZpbGw9IiNmZmQ3MDAiLz48cmVjdCB4PSI0NiIgeT0iMjgiIHdpZHRoPSI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjZmZkNTAwIi8+PHJlY3QgeD0iMTIiIHk9IjE2IiB3aWR0aD0iNCIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZDcwMCIvPjxyZWN0IHg9IjQ4IiB5PSIxNiIgd2lkdGg9IjQiIGhlaWdodD0iMTIiIGZpbGw9IiNmZmQ3MDAiLz48IS0tIExvY2sgLS0+PHJlY3QgeD0iMjgiIHk9IjIyIiB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjYzBjMGMwIi8+PHJlY3QgeD0iMzAiIHk9IjI0IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwMDAwIi8+PCEtLSBIaWdobGlnaHQgLS0+PHJlY3QgeD0iMTIiIHk9IjE2IiB3aWR0aD0iNDIiIGhlaWdodD0iMiIgZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMC4yIi8+PC9zdmc+";

export const SPRITE_STAIRS = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48IS0tIEJhY2tncm91bmQgLS0+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjMWExYTFhIi8+PCEtLSBTdG9uZSBGcmFtZSAtLT48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iNjQiIGhlaWdodD0iOCIgZmlsbD0iIzRlNGU0ZSIvPjxyZWN0IHg9IjAiIHk9IjU2IiB3aWR0aD0iNjQiIGhlaWdodD0iOCIgZmlsbD0iIzRlNGU0ZSIvPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSI4IiBoZWlnaHQ9IjY0IiBmaWxsPSIjNGU0ZTRlIi8+PHJlY3QgeD0iNTYiIHk9IjAiIHdpZHRoPSI4IiBoZWlnaHQ9IjY0IiBmaWxsPSIjNGU0ZTRlIi8+PCEtLSBEZXNjZW5kaW5nIFN0ZXBzIC0tPjxyZWN0IHg9IjgiIHk9IjgiIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgZmlsbD0iIzNjM2MzNiIvPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjMmYyZjJmIi8+PHJlY3QgeD0iMjQiIHk9IjI0IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9IiMxMTExMTEiLz48IS0tIFRoZSBWb2lkIC0tPjxyZWN0IHg9IjI4IiB5PSIyOCIgd2lkdGg9IjgiIGhlaWdodD0iOCIgZmlsbD0iIzAwMDAwMCIvPjwhLS0gSGlnaGxpZ2h0cyAtLT48cmVjdCB4PSI4IiB5PSI4IiB3aWR0aD0iNDgiIGhlaWdodD0iMiIgZmlsbD0iIzY2NjY2NiIgLz48cmVjdCB4PSIxNiIgeT0iMTYiIHdpZHRoPSIzMiIgaGVpZ2h0PSIyIiBmaWxsPSIjNTU1NTU1IiAvPjwvc3ZnPg==";

export const AVATAR_BAT = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48IS0tIFdpbmdzIChEYXJrIFB1cnBsZSkgLS0+PHJlY3QgeD0iMiIgeT0iMjQiIHdpZHRoPSI2MCIgaGVpZ2h0PSIxNiIgZmlsbD0iIzJiMTA0NCIvPjxyZWN0IHg9IjQiIHk9IjIwIiB3aWR0aD0iNTYiIGhlaWdodD0iNCIgZmlsbD0iIzJiMTA0NCIvPjwhLS0gQm9keSAoUHVycGxlKSAtLT48cmVjdCB4PSIyMiIgeT0iMjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iIzZmMzI5OSIvPjwhLS0gRWFycyAtLT48cmVjdCB4PSIyMiIgeT0iMTAiIHdpZHRoPSI2IiBoZWlnaHQ9IjEwIiBmaWxsPSIjNmYzMjk5Ii8+PHJlY3QgeD0iMzYiIHk9IjEwIiB3aWR0aD0iNiIgaGVpZ2h0PSIxMCIgZmlsbD0iIzZmMzI5OSIvPjwhLS0gRXllcyAoUmVkIGZvciBibGlua2luZykgLS0+PHJlY3QgeD0iMjYiIHk9IjI2IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmYwMDAwIi8+PHJlY3QgeD0iMzQiIHk9IjI2IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmYwMDAwIi8+PCEtLSBGYW5ncyAtLT48cmVjdCB4PSIyOSIgeT0iMzQiIHdpZHRoPSIyIiBoZWlnaHQ9IjMiIGZpbGw9IiNmZmYiLz48cmVjdCB4PSIzMyIgeT0iMzQiIHdpZHRoPSIyIiBoZWlnaHQ9IjMiIGZpbGw9IiNmZmYiLz48L3N2Zz4=";

export const AVATAR_SLIME = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48IS0tIE1haW4gQmxvYiAtLT48cmVjdCB4PSIxNiIgeT0iMjgiIHdpZHRoPSIzMiIgaGVpZ2h0PSIyOCIgZmlsbD0iIzAwZmYwMCIgb3BhY2l0eT0iMC42Ii8+PHJlY3QgeD0iMjAiIHk9IjIwIiB3aWR0aD0iMjQiIGhlaWdodD0iOCIgZmlsbD0iIzAwZmYwMCIgb3BhY2l0eT0iMC42Ii8+PCEtLSBDb3JlIC0tPjxyZWN0IHg9IjI0IiB5PSIzMiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjMDA2NjAwIi8+PCEtLSBXZXQgU3BvdHMgLS0+PHJlY3QgeD0iMjIiIHk9IjI0IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjUiLz48cmVjdCB4PSIzOCIgeT0iMzYiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuNSIvPjwhLS0gR2xpdGNoIENpcmN1aXRzIC0tPjxyZWN0IHg9IjI2IiB5PSIzNiIgd2lkdGg9IjgiIGhlaWdodD0iMiIgZmlsbD0iIzAwZmZmZiIvPjxyZWN0IHg9IjI2IiB5PSI0MCIgd2lkdGg9IjEiIGhlaWdodD0iNCIgZmlsbD0iIzAwZmZmZiIvPjxyZWN0IHg9IjMyIiB5PSI0MCIgd2lkdGg9IjEiIGhlaWdodD0iNCIgZmlsbD0iIzAwZmZmZiIvPjxyZWN0IHg9IjE4IiB5PSI0OCIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iIzMzZmYzMyIvPjxyZWN0IHg9IjQyIiB5PSI0OCIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iIzMzZmYzMyIvPjwvc3ZnPg==";

export const AVATAR_SKELETON = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48IS0tIFNrdWxsIEJhc2UgLS0+PHJlY3QgeD0iMjIiIHk9IjEwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9IiNjY2NjY2MiLz48cmVjdCB4PSIyNCIgeT0iMzAiIHdpZHRoPSIxNiIgaGVpZ2h0PSI0IiBmaWxsPSIjY2NjY2NjIi8+PCEtLSBKYXcgLS0+PHJlY3QgeD0iMjAiIHk9IjE0IiB3aWR0aD0iMiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2JiYmJiYiIvPjwhLS0gc2lkZSBzaGFkb3cgLS0+PHJlY3QgeD0iNDIiIHk9IjE0IiB3aWR0aD0iMiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2JiYmJiYiIvPjwhLS0gc2lkZSBzaGFkb3cgLS0+PCEtLSBFeWUgU29ja2V0cyAtLT48cmVjdCB4PSIyNiIgeT0iMTYiIHdpZHRoPSI2IiBoZWlnaHQ9IjgiIGZpbGw9IiMxMTExMTEiLz48cmVjdCB4PSIzMiIgeT0iMTYiIHdpZHRoPSI2IiBoZWlnaHQ9IjgiIGZpbGw9IiMxMTExMTEiLz48IS0tIEdsb3dpbmcgUHVwaWxzIC0tPjxyZWN0IHg9IjI4IiB5PSIxOSIgd2lkdGg9IjIiIGhlaWdodD0iMiIgZmlsbD0iIzAwZmZhYSIvPjxyZWN0IHg9IjM0IiB5PSIxOSIgd2lkdGg9IjIiIGhlaWdodD0iMiIgZmlsbD0iIzAwZmZhYSIvPjwhLS0gTm9zZSBTb2NrZXQgLS0+PHJlY3QgeD0iMzAiIHk9IjI0IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMTExMTExIi8+PCEtLSBUZWV0aCAtLT48cmVjdCB4PSIyNiIgeT0iMzAiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiNhYWFhYWEiLz48cmVjdCB4PSIyOCIgeT0iMzAiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiNkZGRkZGQiLz48cmVjdCB4PSIzMCIgeT0iMzAiIHdpZHRoPSI0IiBoZWlnaHQ9IjIiIGZpbGw9IiNhYWFhYWEiLz48cmVjdCB4PSIzNCIgeT0iMzAiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiNkZGRkZGQiLz48cmVjdCB4PSIzNiIgeT0iMzAiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiNhYWFhYWEiLz48IS0tIFRvcnNvICYgUmlicyAtLT48cmVjdCB4PSIzMCIgeT0iMzQiIHdpZHRoPSI0IiBoZWlnaHQ9IjE4IiBmaWxsPSIjYmJiYmJiIi8+PCEtLSBTcGluZSAtLT48cmVjdCB4PSIyMiIgeT0iMzYiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyIiBmaWxsPSIjY2NjY2NjIi8+PCEtLSBSaWIgMSAtLT48cmVjdCB4PSIyMiIgeT0iNDAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyIiBmaWxsPSIjY2NjY2NjIi8+PCEtLSBSaWIgMiAtLT48cmVjdCB4PSIyNCIgeT0iNDQiIHdpZHRoPSIxNiIgaGVpZ2h0PSIyIiBmaWxsPSIjY2NjY2NjIi8+PCEtLSBSaWIgMyAtLT48IS0tIFNob3VsZGVycyAtLT48cmVjdCB4PSIxOCIgeT0iMzQiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNiYmJiYmIiLz48cmVjdCB4PSI0MiIgeT0iMzQiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNiYmJiYmIiLz48IS0tIFRhdHRlcmVkIFBhdWxkcm9uIC0tPjxyZWN0IHg9IjQwIiB5PSIzMiIgd2lkdGg9IjgiIGhlaWdodD0iOCIgZmlsbD0iIzMzMjIxMSIvPjxyZWN0IHg9IjQyIiB5PSI0MCIgd2lkdGg9IjQiIGhlaWdodD0iMiIgZmlsbD0iIzMzMjIxMSIvPjxyZWN0IHg9IjQ2IiB5PSIzNiIgd2lkdGg9IjIiIGhlaWdodD0iNCIgZmlsbD0iIzIyMTEwMCIvPjwvc3ZnPg==";

export const AVATAR_HOUND = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48IS0tIEJhY2sgTGVncyAtLT48cmVjdCB4PSIxNCIgeT0iNDIiIHdpZHRoPSI2IiBoZWlnaHQ9IjEwIiBmaWxsPSIjMDAyMjAwIi8+PHJlY3QgeD0iMzgiIHk9IjQyIiB3aWR0aD0iNiIgaGVpZ2h0PSIxMCIgZmlsbD0iIzAwMjIwMCIvPjxyZWN0IHg9IjE0IiB5PSI1MiIgd2lkdGg9IjYiIGhlaWdodD0iMiIgZmlsbD0iIzAwMTEwMCIvPjwhLS0gQ2xhd3MgLS0+PHJlY3QgeD0iMzgiIHk9IjUyIiB3aWR0aD0iNiIgaGVpZ2h0PSIyIiBmaWxsPSIjMDAxMTAwIi8+PCEtLSBDbGF3cyAtLT48IS0tIEZyb250IExlZ3MgLS0+PHJlY3QgeD0iMjIiIHk9IjM4IiB3aWR0aD0iOCIgaGVpZ2h0PSIxNiIgZmlsbD0iIzAwMzMwMCIvPjxyZWN0IHg9IjQyIiB5PSIzOCIgd2lkdGg9IjgiIGhlaWdodD0iMTYiIGZpbGw9IiMwMDMzMDAiLz48cmVjdCB4PSIyMiIgeT0iNTQiIHdpZHRoPSI4IiBoZWlnaHQ9IjIiIGZpbGw9IiMwMDExMDAiLz48IS0tIENsYXdzIC0tPjxyZWN0IHg9IjQyIiB5PSI1NCIgd2lkdGg9IjgiIGhlaWdodD0iMiIgZmlsbD0iIzAwMTEwMCIvPjwhLS0gQ2xhd3MgLS0+PCEtLSBCb2R5IC0tPjxyZWN0IHg9IjEyIiB5PSIyNiIgd2lkdGg9IjQwIiBoZWlnaHQ9IjE2IiBmaWxsPSIjMDA0NDAwIi8+PHJlY3QgeD0iMTYiIHk9IjI0IiB3aWR0aD0iMzIiIGhlaWdodD0iMiIgZmlsbD0iIzAwNTUwMCIvPjwhLS0gaGlnaGxpZ2h0IC0tPjwhLS0gTmVjay9TaG91bGRlcnMgLS0+PHJlY3QgeD0iMzgiIHk9IjIwIiB3aWR0aD0iMTQiIGhlaWdodD0iMTgiIGZpbGw9IiMwMDU1MDAiLz48cmVjdCB4PSI0MCIgeT0iMTgiIHdpZHRoPSIxMCIgaGVpZ2h0PSIyIiBmaWxsPSIjMDA2NjAwIi8+PCEtLSBoaWdobGlnaHQgLS0+PCEtLSBIZWFkIC0tPjxyZWN0IHg9IjQ0IiB5PSIyNCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjEyIiBmaWxsPSIjMDA0NDAwIi8+PCEtLSBTbm91dCAtLT48cmVjdCB4PSI1MiIgeT0iMjgiIHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiMwMDY2MDAiLz48IS0tIEV5ZXMgLS0+PHJlY3QgeD0iNDgiIHk9IjI2IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmYwMDAwIi8+PHJlY3QgeD0iNTQiIHk9IjI2IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmYwMDAwIi8+PCEtLSBUZWV0aC9KYXdzIC0tPjxyZWN0IHg9IjUyIiB5PSIzNiIgd2lkdGg9IjgiIGhlaWdodD0iMiIgZmlsbD0iI2NjY2NjYyIvPjxyZWN0IHg9IjU0IiB5PSIzNCIgd2lkdGg9IjIiIGhlaWdodD0iMiIgZmlsbD0iI2ZmZmZmZiIvPjxyZWN0IHg9IjU4IiB5PSIzNCIgd2lkdGg9IjIiIGhlaWdodD0iMiIgZmlsbD0iI2ZmZmZmZiIvPjwhLS0gU3Bpa2VzIC0tPjxyZWN0IHg9IjE2IiB5PSIyMiIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iIzAwNjYwMCIvPjxyZWN0IHg9IjI0IiB5PSIyMiIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iIzAwNjYwMCIvPjxyZWN0IHg9IjMyIiB5PSIyMiIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iIzAwNjYwMCIvPjwhLS0gVGFpbCAtLT48cmVjdCB4PSI2IiB5PSIyOCIgd2lkdGg9IjYiIGhlaWdodD0iNCIgZmlsbD0iIzAwMzMwMCIvPjxyZWN0IHg9IjIiIHk9IjMwIiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAyMjAwIi8+PC9zdmc+";

const AVATAR_WARRIOR = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiMwMDAwMDAiLz48cmVjdCB4PSIxNiIgeT0iMTIiIHdpZHRoPSIzMiIgaGVpZ2h0PSI0MCIgZmlsbD0iIzAwMzMwMCIvPjxyZWN0IHg9IjE4IiB5PSIxMCIgd2lkdGg9IjI4IiBoZWlnaHQ9IjQiIGZpbGw9IiMwMDU1MDAiLz48cmVjdCB4PSIyMCIgeT0iMjQiIHdpZHRoPSIyNCIgaGVpZ2h0PSI2IiBmaWxsPSIjMDAwMDAwIi8+PHJlY3QgeD0iMjIiIHk9IjI2IiB3aWR0aD0iMjAiIGhlaWdodD0iMiIgZmlsbD0iIzMzZmYzMyIvPjxyZWN0IHg9IjMwIiB5PSIzMiIgd2lkdGg9IjQiIGhlaWdodD0iMTQiIGZpbGw9IiMwMDU1MDAiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyIiBmaWxsPSIjMDA0NDAwIi8+PHJlY3QgeD0iMjQiIHk9IjQ4IiB3aWR0aD0iMTYiIGhlaWdodD0iNCIgZmlsbD0iIzAwNTUwMCIvPjwvc3ZnPg==";
const AVATAR_MAGE = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiMwMDAwMDAiLz48cmVjdCB4PSIxNCIgeT0iOCIgd2lkdGg9IjM2IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjMDAyMjAwIi8+PHJlY3QgeD0iMjAiIHk9IjIwIiB3aWR0aD0iMjQiIGhlaWdodD0iMjgiIGZpbGw9IiMwMDAwMDAiLz48cmVjdCB4PSIyMiIgeT0iMjYiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMzM2ZmMzMiLz48cmVjdCB4PSIzOCIgeT0iMjYiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMzM2ZmMzMiLz48cmVjdCB4PSIyNCIgeT0iMjgiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiNmZmZmZmYiLz4KICA8cmVjdCB4PSI0MCIgeT0iMjgiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiNmZmZmZmYiLz4KICA8cmVjdCB4PSIzMCIgeT0iNDAiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMwMDU1MDAiIG9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==";
const AVATAR_CLERIC = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiMwMDAwMDAiLz48cmVjdCB4PSIxOCIgeT0iMTIiIHdpZHRoPSIyOCIgaGVpZ2h0PSI0MCIgZmlsbD0iIzAwNDQwMCIvPjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjMDAxMTAwIi8+PHJlY3QgeD0iMjQiIHk9IjI2IiB3aWR0aD0iNCIgaGVpZ2h0PSIyIiBmaWxsPSIjNjZmZjY2Ii8+PHJlY3QgeD0iMzYiIHk9IjI2IiB3aWR0aD0iNCIgaGVpZ2h0PSIyIiBmaWxsPSIjNjZmZjY2Ii8+PHJlY3QgeD0iMzAiIHk9IjgiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuOCIvPjxyZWN0IHg9IjI4IiB5PSIzNCIgd2lkdGg9IjgiIGhlaWdodD0iMiIgZmlsbD0iIzAwNjYwMCIvPjwvc3ZnPg==";
const AVATAR_BARBARIAN = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiMwMDAwMDAiLz48cmVjdCB4PSIxNiIgeT0iMTYiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0iIzAwMzMwMCIvPjxyZWN0IHg9IjE0IiB5PSI4IiB3aWR0aD0iMzYiIGhlaWdodD0iMTIiIGZpbGw9IiMwMDU1MDAiLz48cmVjdCB4PSIxMiIgeT0iMTIiIHdpZHRoPSI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjMDA1NTAwIi8+PHJlY3QgeD0iNDgiIHk9IjEyIiB3aWR0aD0iNCIgaGVpZ2h0PSIyNCIgZmlsbD0iIzAwNTUwMCIvPjxyZWN0IHg9IjIyIiB5PSIyNCIgd2lkdGg9IjYiIGhlaWdodD0iNCIgZmlsbD0iIzAwMDAwMCIvPjxyZWN0IHg9IjM2IiB5PSIyNCIgd2lkdGg9IjYiIGhlaWdodD0iNCIgZmlsbD0iIzAwMDAwMCIvPjxyZWN0IHg9IjIzIiB5PSIyNCIgd2lkdGg9IjIiIGhlaWdodD0iMiIgZmlsbD0iI2ZmZmZmZiIvPjxyZWN0IHg9IjM3IiB5PSIyNCIgd2lkdGg9IjIiIGhlaWdodD0iMiIgZmlsbD0iI2ZmZmZmZiIvPjxyZWN0IHg9IjIyIiB5PSIzMCIgd2lkdGg9IjQiIGhlaWdodD0iMiIgZmlsbD0iIzAwNTUwMCIvPjxyZWN0IHg9IjM4IiB5PSIzMCIgd2lkdGg9IjQiIGhlaWdodD0iMiIgZmlsbD0iIzAwNTUwMCIvPjxyZWN0IHg9IjMwIiB5PSIzOCIgd2lkdGg9IjQiIGhlaWdodD0iMiIgZmlsbD0iIzAwMDAwMCIvPjwvc3ZnPg==";
const AVATAR_ARCHER = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj4KICA8IS0tIEJhY2tncm91bmQgLS0+CiAgPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjMDAwMDAwIi8+CiAgPCEtLSBHcmVlbiBIb29kL0Nsb2FrIC0tPgogIDxyZWN0IHg9IjE2IiB5PSIxMiIgd2lkdGg9IjMyIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMDA0NDAwIi8+CiAgPHJlY3QgeD0iMjAiIHk9IjgiIHdpZHRoPSIyNCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDA0NDAwIi8+CiAgPCEtLSBGYWNlIFNoYWRvdyAtLT4KICA8cmVjdCB4PSIyMCIgeT0iMjAiIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0iIzAwMjIwMCIvPgogIDwhLS0gRXllcyAoV2hpdGUgZm9yIGJsaW5raW5nKSAtLT4KICA8cmVjdCB4PSIyNCIgeT0iMjYiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmZmZmYiLz4KICA8cmVjdCB4PSIzNCIgeT0iMjYiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmZmZmYiLz4KICA8IS0tIEJvdyAtLT4KICA8cmVjdCB4PSIxMiIgeT0iMTYiIHdpZHRoPSI0IiBoZWlnaHQ9IjMyIiBmaWxsPSIjOEI0NTEzIi8+CiAgPHJlY3QgeD0iMTQiIHk9IjE0IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjOEI0NTEzIi8+CiAgPHJlY3QgeD0iMTQiIHk9IjQ2IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjOEI0NTEzIi8+CiAgPCEtLSBTdHJpbmcgLS0+CiAgPHJlY3QgeD0iMTQiIHk9IjE4IiB3aWR0aD0iMSIgaGVpZ2h0PSIyOCIgZmlsbD0iI0FBQUFBQSIgb3BhY2l0eT0iMC41Ii8+Cjwvc3ZnPg==";
const AVATAR_ROGUE = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiMwMDAwMDAiLz48cmVjdCB4PSIxOCIgeT0iMTIiIHdpZHRoPSIyOCIgaGVpZ2h0PSIzNiIgZmlsbD0iIzAwMzMwMCIvPjxyZWN0IHg9IjIwIiB5PSIyNCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjYiIGZpbGw9IiMwMDU1MDAiLz48cmVjdCB4PSIzNCIgeT0iMjQiIHdpZHRoPSIxMCIgaGVpZ2h0PSI2IiBmaWxsPSIjMDA1NTAwIi8+PHJlY3QgeD0iMjIiIHk9IjI1IiB3aWR0aD0iNiIgaGVpZ2h0PSI0IiBmaWxsPSIjZmYwMDAwIiAvPjxyZWN0IHg9IjM2IiB5PSIyNCIgd2lkdGg9IjYiIGhlaWdodD0iNCIgZmlsbD0iI2ZmMDAwMCIgLz48cmVjdCB4PSIxOCIgeT0iMzQiIHdpZHRoPSIyOCIgaGVpZ2h0PSIxNCIgZmlsbD0iIzAwMjIwMCIvPjxyZWN0IHg9IjMwIiB5PSIzNiIgd2lkdGg9IjQiIGhlaWdodD0iMiIgZmlsbD0iIzAwMTEwMCIgb3BhY2l0eT0iMC4zIi8+PC9zdmc+";

// APTITUDE SYSTEM
export const CLASS_APTITUDES: Record<PlayerClass, Record<EquipmentWeight, number>> = {
  BARBARIAN: { LIGHT: 0.70, MEDIUM: 0.90, HEAVY: 1.00 },
  WARRIOR:   { LIGHT: 0.80, MEDIUM: 1.00, HEAVY: 1.00 },
  CLERIC:    { LIGHT: 0.85, MEDIUM: 1.00, HEAVY: 0.90 },
  ARCHER:    { LIGHT: 1.00, MEDIUM: 0.80, HEAVY: 0.60 }, 
  ROGUE:     { LIGHT: 1.00, MEDIUM: 0.85, HEAVY: 0.65 }, 
  MAGE:      { LIGHT: 1.00, MEDIUM: 0.80, HEAVY: 0.50 }  
};

export const MOD_POOL: ItemMod[] = [
  { stat: 'str', value: 2, name: 'of Might' },
  { stat: 'int', value: 2, name: 'of Mind' },
  { stat: 'dex', value: 2, name: 'of Speed' },
  { stat: 'vit', value: 2, name: 'of Vitality' },
  { stat: 'atk', value: 5, name: 'of Power' },
  { stat: 'def', value: 5, name: 'of Guard' },
  { stat: 'critChance', value: 5, name: 'of Precision' },
  { stat: 'hp', value: 20, name: 'of Health' },
  { stat: 'mp', value: 10, name: 'of Spirit' }
];

export const ITEMS: Item[] = [
    // --- LIGHT WEIGHT EQUIPMENT (Helms/Chests) ---
    { id: 'l_helm_1', name: 'Ragged Hood', type: 'helm', weight: 'LIGHT', value: 50, stat: 3, magicStat: 4, minLevel: 1, mods: [{stat: 'eva', value: 2, name: 'Agile'}], description: 'Focus: DEX, Evasion, MDEF' },
    { id: 'l_chest_1', name: 'Leather Jerkin', type: 'chest', weight: 'LIGHT', value: 250, stat: 6, magicStat: 6, minLevel: 5, mods: [{stat: 'dex', value: 1, name: 'Quick'}], description: 'Light protection.' },
    { id: 'l_helm_2', name: 'Shadow Hood', type: 'helm', weight: 'LIGHT', value: 600, stat: 7, magicStat: 10, minLevel: 12, mods: [{stat: 'eva', value: 4, name: 'Shadow'}], description: 'Hard to see in the dark.' },
    { id: 'l_chest_2', name: 'Dark Leather Coat', type: 'chest', weight: 'LIGHT', value: 800, stat: 13, magicStat: 12, minLevel: 16, mods: [{stat: 'dex', value: 2, name: 'Swift'}], description: 'Favored by thieves.' },
    { id: 'l_helm_3', name: 'Assassin’s Veil', type: 'helm', weight: 'LIGHT', value: 1100, stat: 14, magicStat: 18, minLevel: 22, mods: [{stat: 'eva', value: 6, name: 'Hidden'}], description: 'Conceals intent.' },
    { id: 'l_chest_3', name: 'Silent Leather Armor', type: 'chest', weight: 'LIGHT', value: 1300, stat: 22, magicStat: 20, minLevel: 26, mods: [{stat: 'dex', value: 3, name: 'Silent'}], description: 'Makes no sound.' },
    { id: 'l_helm_4', name: 'Phantom Hood', type: 'helm', weight: 'LIGHT', value: 1600, stat: 22, magicStat: 28, minLevel: 32, mods: [{stat: 'eva', value: 9, name: 'Ghost'}], description: 'Phase through danger.' },
    { id: 'l_chest_4', name: 'Spectral Leather Coat', type: 'chest', weight: 'LIGHT', value: 1800, stat: 35, magicStat: 32, minLevel: 36, mods: [{stat: 'dex', value: 4, name: 'Spectral'}], description: 'Otherworldly material.' },
    { id: 'l_helm_5', name: 'Nightveil Hood', type: 'helm', weight: 'LIGHT', value: 2100, stat: 34, magicStat: 40, minLevel: 42, mods: [{stat: 'eva', value: 12, name: 'Night'}], description: 'One with the dark.' },
    { id: 'l_chest_5', name: 'Eclipse Leather Armor', type: 'chest', weight: 'LIGHT', value: 2300, stat: 55, magicStat: 44, minLevel: 46, mods: [{stat: 'dex', value: 5, name: 'Eclipse'}], description: 'Blocks all light.' },
    { id: 'l_helm_6', name: 'Veil of the Forsaken', type: 'helm', weight: 'LIGHT', value: 2750, stat: 52, magicStat: 60, minLevel: 55, mods: [{stat: 'dex', value: 6, name: 'Forsaken'}, {stat: 'eva', value: 18, name: 'Lost'}], description: 'Ancient assassin gear.' },

    // --- MEDIUM WEIGHT EQUIPMENT ---
    { id: 'm_helm_1', name: 'Traveler’s Helm', type: 'helm', weight: 'MEDIUM', value: 50, stat: 5, magicStat: 3, minLevel: 1, description: 'Basic protection.' },
    { id: 'm_chest_1', name: 'Chain Vest', type: 'chest', weight: 'MEDIUM', value: 300, stat: 9, magicStat: 6, minLevel: 6, description: 'Interlinked rings.' },
    { id: 'm_helm_2', name: 'Mercenary Helm', type: 'helm', weight: 'MEDIUM', value: 600, stat: 11, magicStat: 8, minLevel: 12, description: 'Standard issue.' },
    { id: 'm_chest_2', name: 'Steel Chainmail', type: 'chest', weight: 'MEDIUM', value: 800, stat: 18, magicStat: 12, minLevel: 16, description: 'Solid steel rings.' },
    { id: 'm_helm_3', name: 'Knight Helm', type: 'helm', weight: 'MEDIUM', value: 1100, stat: 19, magicStat: 15, minLevel: 22, description: 'Worn by honor guards.' },
    { id: 'm_chest_3', name: 'Reinforced Chainmail', type: 'chest', weight: 'MEDIUM', value: 1300, stat: 32, magicStat: 20, minLevel: 26, description: 'Double layered.' },
    { id: 'm_helm_4', name: 'Templar Helm', type: 'helm', weight: 'MEDIUM', value: 1600, stat: 30, magicStat: 28, minLevel: 32, mods: [{stat: 'hp', value: 120, name: 'Holy'}], description: 'Blessed steel.' },
    { id: 'm_chest_4', name: 'Blessed Chainmail', type: 'chest', weight: 'MEDIUM', value: 1800, stat: 50, magicStat: 32, minLevel: 36, mods: [{stat: 'hp', value: 180, name: 'Sacred'}], description: 'Anointed in oils.' },
    { id: 'm_helm_5', name: 'Royal Helm', type: 'helm', weight: 'MEDIUM', value: 2100, stat: 48, magicStat: 38, minLevel: 42, mods: [{stat: 'hp', value: 250, name: 'Regal'}], description: 'Fit for a king.' },
    { id: 'm_chest_5', name: 'King’s Chainmail', type: 'chest', weight: 'MEDIUM', value: 2300, stat: 78, magicStat: 44, minLevel: 46, mods: [{stat: 'hp', value: 320, name: 'Majestic'}], description: 'Legendary defense.' },
    { id: 'm_helm_6', name: 'Helm of the Oathbound', type: 'helm', weight: 'MEDIUM', value: 2750, stat: 75, magicStat: 60, minLevel: 55, mods: [{stat: 'hp', value: 500, name: 'Eternal'}], description: 'For those who keep promises.' },

    // --- HEAVY WEIGHT EQUIPMENT ---
    { id: 'h_helm_1', name: 'Rusty Iron Helm', type: 'helm', weight: 'HEAVY', value: 50, stat: 8, magicStat: 1, minLevel: 1, mods: [{stat: 'dex', value: -1, name: 'Heavy'}], description: 'Heavy and corroded.' },
    { id: 'h_chest_1', name: 'Iron Cuirass', type: 'chest', weight: 'HEAVY', value: 300, stat: 14, magicStat: 3, minLevel: 6, mods: [{stat: 'dex', value: -1, name: 'Rigid'}], description: 'Solid iron plate.' },
    { id: 'h_helm_2', name: 'Heavy Iron Helm', type: 'helm', weight: 'HEAVY', value: 600, stat: 16, magicStat: 6, minLevel: 12, mods: [{stat: 'dex', value: -2, name: 'Dense'}], description: 'Hard to move head.' },
    { id: 'h_chest_2', name: 'Steel Cuirass', type: 'chest', weight: 'HEAVY', value: 800, stat: 26, magicStat: 8, minLevel: 16, mods: [{stat: 'dex', value: -2, name: 'Solid'}], description: 'Tempered steel.' },
    { id: 'h_helm_3', name: 'Warplate Helm', type: 'helm', weight: 'HEAVY', value: 1100, stat: 27, magicStat: 10, minLevel: 22, mods: [{stat: 'dex', value: -3, name: 'Bulky'}], description: 'For the front lines.' },
    { id: 'h_chest_3', name: 'Heavy Steel Plate', type: 'chest', weight: 'HEAVY', value: 1300, stat: 44, magicStat: 12, minLevel: 26, mods: [{stat: 'dex', value: -3, name: 'Massive'}], description: 'Immense protection.' },
    { id: 'h_helm_4', name: 'Crusader Helm', type: 'helm', weight: 'HEAVY', value: 1600, stat: 42, magicStat: 16, minLevel: 32, mods: [{stat: 'dex', value: -4, name: 'Iron'}], description: 'Worn by holy warriors.' },
    { id: 'h_chest_4', name: 'Sacred Plate Armor', type: 'chest', weight: 'HEAVY', value: 1800, stat: 68, magicStat: 18, minLevel: 36, mods: [{stat: 'dex', value: -4, name: 'Divine'}], description: 'Blessed by the church.' },
    { id: 'h_helm_5', name: 'Titan Helm', type: 'helm', weight: 'HEAVY', value: 2100, stat: 65, magicStat: 22, minLevel: 42, mods: [{stat: 'dex', value: -5, name: 'Colossal'}], description: 'Giant sized.' },
    { id: 'h_chest_5', name: 'Colossus Plate', type: 'chest', weight: 'HEAVY', value: 2300, stat: 102, magicStat: 26, minLevel: 46, mods: [{stat: 'dex', value: -5, name: 'Unmoving'}], description: 'Walking fortress.' },
    { id: 'h_helm_6', name: 'Armor of the Fallen Titan', type: 'chest', weight: 'HEAVY', value: 2750, stat: 140, magicStat: 32, minLevel: 55, mods: [{stat: 'dex', value: -6, name: 'Fallen'}, {stat: 'hp', value: 500, name: 'Undying'}], description: 'A relic of a dead god.' },

    // --- LIGHT WEAPONS ---
    { id: 'w_l_1', name: 'Rusted Dagger', type: 'weapon', weight: 'LIGHT', value: 50, stat: 6, minLevel: 1, mods: [{stat: 'critChance', value: 3, name: 'Sharp'}, {stat: 'dex', value: 1, name: 'Light'}], description: 'Focus: DEX, Crit' },
    { id: 'w_l_2', name: 'Short Blade', type: 'weapon', weight: 'LIGHT', value: 300, stat: 10, minLevel: 6, mods: [{stat: 'dex', value: 2, name: 'Quick'}], description: 'Balanced short sword.' },
    { id: 'w_l_3', name: 'Twin Daggers', type: 'weapon', weight: 'LIGHT', value: 600, stat: 16, minLevel: 12, mods: [{stat: 'critChance', value: 5, name: 'Vicious'}, {stat: 'dex', value: 2, name: 'Dual'}], description: 'One for each hand.' },
    { id: 'w_l_4', name: 'Light Mace', type: 'weapon', weight: 'LIGHT', value: 800, stat: 18, minLevel: 16, description: 'Cleric weapon.' },
    { id: 'w_l_5', name: 'Assassin Fang', type: 'weapon', weight: 'LIGHT', value: 1100, stat: 26, minLevel: 22, mods: [{stat: 'critChance', value: 8, name: 'Deadly'}, {stat: 'dex', value: 3, name: 'Silent'}], description: 'Drips with venom.' },
    { id: 'w_l_6', name: 'Silent Talon', type: 'weapon', weight: 'LIGHT', value: 1300, stat: 34, minLevel: 26, mods: [{stat: 'critChance', value: 10, name: 'Backstab'}, {stat: 'dex', value: 3, name: 'Hushed'}], description: 'Never heard.' },
    { id: 'w_l_7', name: 'Phantom Daggers', type: 'weapon', weight: 'LIGHT', value: 1600, stat: 46, minLevel: 32, mods: [{stat: 'critChance', value: 12, name: 'Ghostly'}, {stat: 'dex', value: 4, name: 'Fast'}], description: 'Attacks the soul.' },
    { id: 'w_l_8', name: 'Blessed Scepter', type: 'weapon', weight: 'LIGHT', value: 1800, stat: 48, minLevel: 36, mods: [{stat: 'mAtk', value: 10, name: 'Healing'}, {stat: 'dex', value: 2, name: 'Grace'}], description: 'Healing +5%.' },
    { id: 'w_l_9', name: 'Nightpiercer', type: 'weapon', weight: 'LIGHT', value: 2100, stat: 62, minLevel: 42, mods: [{stat: 'critChance', value: 15, name: 'Piercing'}, {stat: 'dex', value: 5, name: 'Dark'}], description: 'Strikes from shadows.' },
    { id: 'w_l_10', name: 'Eclipse Blades', type: 'weapon', weight: 'LIGHT', value: 2300, stat: 78, minLevel: 46, mods: [{stat: 'dex', value: 6, name: 'Eclipse'}], description: 'Consumes light.' },
    { id: 'w_l_11', name: 'Fang of the Forsaken', type: 'weapon', weight: 'LIGHT', value: 2750, stat: 110, minLevel: 55, mods: [{stat: 'critChance', value: 20, name: 'Fatal'}, {stat: 'dex', value: 8, name: 'Godly'}], description: 'Crit +20%, Backstab +20%.' },

    // --- MEDIUM WEAPONS ---
    { id: 'w_m_1', name: 'Iron Sword', type: 'weapon', weight: 'MEDIUM', value: 50, stat: 9, minLevel: 1, description: 'Standard blade.' },
    { id: 'w_m_2', name: 'Wooden Warhammer', type: 'weapon', weight: 'MEDIUM', value: 300, stat: 14, minLevel: 6, description: 'Surprisingly heavy.' },
    { id: 'w_m_3', name: 'Steel Sword', type: 'weapon', weight: 'MEDIUM', value: 600, stat: 22, minLevel: 12, mods: [{stat: 'dex', value: 1, name: 'Balanced'}], description: 'Quality steel.' },
    { id: 'w_m_4', name: 'Flanged Mace', type: 'weapon', weight: 'MEDIUM', value: 800, stat: 26, minLevel: 16, description: 'Cleric bonus.' },
    { id: 'w_m_5', name: 'Knight Longsword', type: 'weapon', weight: 'MEDIUM', value: 1100, stat: 38, minLevel: 22, mods: [{stat: 'dex', value: 2, name: 'Noble'}], description: 'Knightly weapon.' },
    { id: 'w_m_6', name: 'Battle Axe', type: 'weapon', weight: 'MEDIUM', value: 1300, stat: 44, minLevel: 26, description: 'Good for chopping.' },
    { id: 'w_m_7', name: 'Templar Mace', type: 'weapon', weight: 'MEDIUM', value: 1600, stat: 58, minLevel: 32, mods: [{stat: 'mAtk', value: 5, name: 'Holy'}], description: 'Holy Damage.' },
    { id: 'w_m_8', name: 'Vanguard Blade', type: 'weapon', weight: 'MEDIUM', value: 1800, stat: 64, minLevel: 36, mods: [{stat: 'dex', value: 3, name: 'Vanguard'}], description: 'Frontline choice.' },
    { id: 'w_m_9', name: 'Royal War Axe', type: 'weapon', weight: 'MEDIUM', value: 2100, stat: 82, minLevel: 42, description: 'Ornate and deadly.' },
    { id: 'w_m_10', name: 'Champion Sword', type: 'weapon', weight: 'MEDIUM', value: 2300, stat: 96, minLevel: 46, mods: [{stat: 'dex', value: 4, name: 'Champ'}], description: 'For true heroes.' },
    { id: 'w_m_11', name: 'Oathbound Relic Blade', type: 'weapon', weight: 'MEDIUM', value: 2750, stat: 130, minLevel: 55, mods: [{stat: 'hp', value: 50, name: 'Leech'}], description: 'HP Steal 5%.' },

    // --- HEAVY WEAPONS ---
    { id: 'w_h_1', name: 'Rusted Greatclub', type: 'weapon', weight: 'HEAVY', value: 50, stat: 14, minLevel: 1, mods: [{stat: 'dex', value: -1, name: 'Heavy'}], description: 'Crude impact.' },
    { id: 'w_h_2', name: 'Iron Great Axe', type: 'weapon', weight: 'HEAVY', value: 300, stat: 22, minLevel: 6, mods: [{stat: 'dex', value: -1, name: 'Big'}], description: 'Takes two hands.' },
    { id: 'w_h_3', name: 'Heavy Warhammer', type: 'weapon', weight: 'HEAVY', value: 600, stat: 36, minLevel: 12, mods: [{stat: 'dex', value: -2, name: 'Stun'}], description: 'Stun Chance.' },
    { id: 'w_h_4', name: 'Executioner Axe', type: 'weapon', weight: 'HEAVY', value: 800, stat: 42, minLevel: 16, mods: [{stat: 'dex', value: -2, name: 'Grim'}], description: 'Heads will roll.' },
    { id: 'w_h_5', name: 'Colossal Maul', type: 'weapon', weight: 'HEAVY', value: 1100, stat: 58, minLevel: 22, mods: [{stat: 'dex', value: -3, name: 'Break'}], description: 'Armor Break.' },
    { id: 'w_h_6', name: 'Titan Cleaver', type: 'weapon', weight: 'HEAVY', value: 1300, stat: 68, minLevel: 26, mods: [{stat: 'dex', value: -3, name: 'Titan'}], description: 'Cleaves stone.' },
    { id: 'w_h_7', name: 'Crusader Greatmace', type: 'weapon', weight: 'HEAVY', value: 1600, stat: 86, minLevel: 32, mods: [{stat: 'dex', value: -4, name: 'Holy'}, {stat: 'mAtk', value: 10, name: 'Smite'}], description: 'Holy Damage.' },
    { id: 'w_h_8', name: 'Juggernaut Axe', type: 'weapon', weight: 'HEAVY', value: 1800, stat: 98, minLevel: 36, mods: [{stat: 'dex', value: -4, name: 'Jugger'}], description: 'Unstoppable.' },
    { id: 'w_h_9', name: 'Colossus Breaker', type: 'weapon', weight: 'HEAVY', value: 2100, stat: 118, minLevel: 42, mods: [{stat: 'dex', value: -5, name: 'Shatter'}], description: 'AoE Impact.' },
    { id: 'w_h_10', name: 'Worldrender', type: 'weapon', weight: 'HEAVY', value: 2300, stat: 140, minLevel: 46, mods: [{stat: 'dex', value: -5, name: 'Rent'}], description: 'Staggering power.' },
    { id: 'w_h_11', name: 'Doom of the Fallen Titan', type: 'weapon', weight: 'HEAVY', value: 2750, stat: 190, minLevel: 55, mods: [{stat: 'dex', value: -6, name: 'Doom'}], description: 'AoE + Stun.' },

    // --- ACCESSORIES ---
    { id: 'acc_1', name: 'Tattered Ring', type: 'accessory', value: 50, minLevel: 1, mods: [{stat: 'hp', value: 20, name: 'Life'}], description: 'A simple band.' },
    { id: 'acc_2', name: 'Copper Pendant', type: 'accessory', value: 150, minLevel: 3, mods: [{stat: 'def', value: 2, name: 'Copper'}], description: 'Minor protection.' },
    { id: 'acc_3', name: 'Traveler’s Charm', type: 'accessory', value: 250, minLevel: 5, mods: [{stat: 'hp', value: 10, name: 'Endure'}], description: 'Stamina +10.' },
    { id: 'acc_4', name: 'Ring of Focus', type: 'accessory', value: 350, minLevel: 7, mods: [{stat: 'dex', value: 1, name: 'Focus'}], description: 'Improves aim.' },
    { id: 'acc_5', name: 'Minor Vitality Ring', type: 'accessory', value: 500, minLevel: 10, mods: [{stat: 'hp', value: 50, name: 'Vit'}], description: 'Health boost.' },
    { id: 'acc_6', name: 'Silver Ring', type: 'accessory', value: 600, minLevel: 12, mods: [{stat: 'def', value: 4, name: 'Silver'}], description: 'Shiny defense.' },
    { id: 'acc_7', name: 'Amulet of Precision', type: 'accessory', value: 700, minLevel: 14, mods: [{stat: 'critChance', value: 3, name: 'Precise'}], description: 'Crit +3%.' },
    { id: 'acc_8', name: 'Blessed Beads', type: 'accessory', value: 800, minLevel: 16, mods: [{stat: 'mAtk', value: 5, name: 'Bless'}], description: 'Healing +5%.' },
    { id: 'acc_9', name: 'Shadow Band', type: 'accessory', value: 900, minLevel: 18, mods: [{stat: 'eva', value: 3, name: 'Dim'}], description: 'Eva +3%.' },
    { id: 'acc_10', name: 'Ring of Endurance', type: 'accessory', value: 1000, minLevel: 20, mods: [{stat: 'hp', value: 25, name: 'Endure'}], description: 'Stamina +25.' },
    { id: 'acc_11', name: 'Iron Signet', type: 'accessory', value: 1100, minLevel: 22, mods: [{stat: 'hp', value: 120, name: 'Iron'}], description: 'Solid vitality.' },
    { id: 'acc_12', name: 'Amulet of Balance', type: 'accessory', value: 1200, minLevel: 24, mods: [{stat: 'str', value: 1, name: 'Bal'}, {stat: 'dex', value: 1, name: 'Ance'}], description: 'STR +1, DEX +1.' },
    { id: 'acc_13', name: 'Ring of Fortitude', type: 'accessory', value: 1300, minLevel: 26, mods: [{stat: 'def', value: 6, name: 'Fort'}], description: 'Hardy defense.' },
    { id: 'acc_14', name: 'Blood Token', type: 'accessory', value: 1400, minLevel: 28, mods: [{stat: 'hp', value: 20, name: 'Blood'}], description: 'Life Steal +2%.' },
    { id: 'acc_15', name: 'Dark Talisman', type: 'accessory', value: 1500, minLevel: 30, mods: [{stat: 'atk', value: 5, name: 'Dark'}], description: 'Damage +5%.' },
    { id: 'acc_16', name: 'Rune-etched Ring', type: 'accessory', value: 1600, minLevel: 32, mods: [{stat: 'hp', value: 200, name: 'Rune'}], description: 'Ancient health.' },
    { id: 'acc_17', name: 'Amulet of Swiftness', type: 'accessory', value: 1700, minLevel: 34, mods: [{stat: 'dex', value: 3, name: 'Swift'}], description: 'Speed boost.' },
    { id: 'acc_18', name: 'Sacred Rosary', type: 'accessory', value: 1800, minLevel: 36, mods: [{stat: 'mAtk', value: 10, name: 'Sacred'}], description: 'Healing +10%.' },
    { id: 'acc_19', name: 'Veilstone Pendant', type: 'accessory', value: 1900, minLevel: 38, mods: [{stat: 'eva', value: 6, name: 'Veil'}], description: 'Eva +6%.' },
    { id: 'acc_20', name: 'Ring of the Valiant', type: 'accessory', value: 2000, minLevel: 40, mods: [{stat: 'hp', value: 300, name: 'Valor'}], description: 'Heroic health.' },
    { id: 'acc_21', name: 'Obsidian Signet', type: 'accessory', value: 2100, minLevel: 42, mods: [{stat: 'def', value: 10, name: 'Black'}], description: 'Obsidian hard.' },
    { id: 'acc_22', name: 'Amulet of Lethality', type: 'accessory', value: 2200, minLevel: 44, mods: [{stat: 'critChance', value: 8, name: 'Lethal'}], description: 'Crit +8%.' },
    { id: 'acc_23', name: 'Relic of Endurance', type: 'accessory', value: 2300, minLevel: 46, mods: [{stat: 'hp', value: 60, name: 'Relic'}], description: 'Stamina +60.' },
    { id: 'acc_24', name: 'Blood-Sealed Ring', type: 'accessory', value: 2400, minLevel: 48, mods: [{stat: 'hp', value: 50, name: 'Seal'}], description: 'Life Steal +5%.' },
    { id: 'acc_25', name: 'Abyssal Charm', type: 'accessory', value: 2500, minLevel: 50, mods: [{stat: 'atk', value: 10, name: 'Abyss'}], description: 'Damage +10%.' },
    { id: 'acc_26', name: 'Runic Emblem', type: 'accessory', value: 2600, minLevel: 52, mods: [{stat: 'hp', value: 450, name: 'Emblem'}], description: 'Massive HP.' },
    { id: 'acc_27', name: 'Amulet of Mastery', type: 'accessory', value: 2700, minLevel: 54, mods: [{stat: 'str', value: 3, name: 'Master'}, {stat: 'dex', value: 3, name: 'Skill'}], description: 'STR +3, DEX +3.' },
    { id: 'acc_28', name: 'Eclipse Talisman', type: 'accessory', value: 2800, minLevel: 56, mods: [{stat: 'critChance', value: 12, name: 'Eclipse'}, {stat: 'eva', value: 6, name: 'Shade'}], description: 'Crit +12%, Eva +6%.' },
    { id: 'acc_29', name: 'Relic of the Undying', type: 'accessory', value: 2900, minLevel: 58, mods: [{stat: 'hp', value: 20, name: 'Undying'}], description: 'HP Regen +2%.' },
    { id: 'acc_30', name: 'Sigil of the Forsaken', type: 'accessory', value: 3000, minLevel: 60, mods: [{stat: 'hp', value: 600, name: 'Forsaken'}, {stat: 'atk', value: 15, name: 'Power'}], description: 'Ultimate power.' },
    
    // Potions (Kept)
    { id: 'pot_hp_s', name: 'Nanite Patch', type: 'consumable', value: 10, stat: 50, description: 'Restores 50 HP.' },
    { id: 'pot_mp_s', name: 'Mana cell', type: 'consumable', value: 20, magicStat: 30, description: 'Restores 30 MP.' },
];

export const MATERIALS: Item[] = [
    { id: 'scrap', name: 'Scrap Metal', type: 'material', value: 5, description: 'Useless junk.' },
    { id: 'chip', name: 'Logic Chip', type: 'material', value: 15, description: 'Basic component.' },
    { id: 'core', name: 'Power Core', type: 'material', value: 50, description: 'Rare energy source.' },
];

export const ENEMIES: Enemy[] = [
    { id: 'bat', name: 'Byte Bat', hp: 30, maxHp: 30, mp: 0, maxMp: 0, level: 1, str: 5, int: 1, dex: 10, vit: 5, cha: 1, buffs: [], instanceId: '', xpValue: 10, goldValue: 5, color: '#ff0000', seed: 1, prompt: 'bat', avatar: AVATAR_BAT },
    { id: 'slime', name: 'Glitch Slime', hp: 40, maxHp: 40, mp: 0, maxMp: 0, level: 1, str: 4, int: 1, dex: 2, vit: 10, cha: 1, buffs: [], instanceId: '', xpValue: 15, goldValue: 8, color: '#00ff00', seed: 2, prompt: 'slime', avatar: AVATAR_SLIME },
    { id: 'skeleton', name: 'Null Frame', hp: 50, maxHp: 50, mp: 0, maxMp: 0, level: 2, str: 8, int: 1, dex: 5, vit: 8, cha: 1, buffs: [], instanceId: '', xpValue: 25, goldValue: 12, color: '#ffffff', seed: 3, prompt: 'skeleton', avatar: AVATAR_SKELETON },
    { id: 'hound', name: 'Data Hound', hp: 80, maxHp: 80, mp: 10, maxMp: 10, level: 3, str: 12, int: 4, dex: 8, vit: 10, cha: 2, buffs: [], instanceId: '', xpValue: 40, goldValue: 20, color: '#ffaa00', seed: 4, prompt: 'hound', avatar: AVATAR_HOUND },
];

export const SKILLS: Skill[] = [
  // Warrior
  { id: 'w_bash', name: 'Shield Bash', desc: 'Stuns enemy.', cost: 5, type: 'attack', targetType: 'enemy', minLevel: 1, basePower: 1.2 },
  { id: 'w_wall', name: 'Shield Wall', desc: 'Boosts DEF.', cost: 8, type: 'buff', targetType: 'self', minLevel: 3 },
  { id: 'w_cry', name: 'War Cry', desc: 'Boosts ATK.', cost: 10, type: 'buff', targetType: 'ally', minLevel: 5 },
  { id: 'w_cleave', name: 'Cleave', desc: 'Hits all enemies.', cost: 15, type: 'attack', targetType: 'enemy', minLevel: 8, isAoe: true, basePower: 0.8 },
  
  // Mage
  { id: 'm_fire', name: 'Fireball', desc: 'High fire damage.', cost: 8, type: 'special', targetType: 'enemy', minLevel: 1, basePower: 1.5 },
  { id: 'm_shield', name: 'Mana Shield', desc: 'Boosts M.DEF.', cost: 10, type: 'buff', targetType: 'self', minLevel: 3 },
  { id: 'm_solar', name: 'Solar Flare', desc: 'AoE Fire damage.', cost: 20, type: 'special', targetType: 'enemy', minLevel: 8, isAoe: true, basePower: 1.2 },
  
  // Cleric
  { id: 'c_heal', name: 'Heal', desc: 'Restores HP.', cost: 8, type: 'heal', targetType: 'ally', minLevel: 1, basePower: 1.5 },
  { id: 'c_bless', name: 'Blessing', desc: 'Boosts STR.', cost: 10, type: 'buff', targetType: 'ally', minLevel: 3 },
  { id: 'c_revive', name: 'Revive', desc: 'Revives fallen ally.', cost: 25, type: 'heal', targetType: 'ally', minLevel: 10, revive: true },
  
  // Barbarian
  { id: 'b_smash', name: 'Smash', desc: 'Heavy damage.', cost: 6, type: 'attack', targetType: 'enemy', minLevel: 1, basePower: 1.4 },
  { id: 'b_rage', name: 'Rage', desc: 'Increases ATK passively.', cost: 0, type: 'passive', targetType: 'self', minLevel: 2, passiveStat: 'atk', passiveVal: 5 },
  { id: 'b_shout', name: 'Battle Shout', desc: 'Stuns all enemies.', cost: 15, type: 'buff', targetType: 'enemy', minLevel: 8, isAoe: true },
  { id: 'b_blood', name: 'Bloodlust', desc: 'Attack converts damage to HP.', cost: 12, type: 'attack', targetType: 'enemy', minLevel: 5, basePower: 1.0 },

  // Archer
  { id: 'a_shot', name: 'Power Shot', desc: 'High crit chance.', cost: 6, type: 'attack', targetType: 'enemy', minLevel: 1, basePower: 1.3 },
  { id: 'a_eye', name: 'Eagle Eye', desc: 'Boosts Crit Chance.', cost: 8, type: 'buff', targetType: 'self', minLevel: 3 },
  { id: 'a_volley', name: 'Arrow Volley', desc: 'Hits random enemies.', cost: 12, type: 'attack', targetType: 'enemy', minLevel: 6, isAoe: true, basePower: 0.7 },
  { id: 'a_tox', name: 'Toxic Shot', desc: 'Poison damage.', cost: 10, type: 'attack', targetType: 'enemy', minLevel: 4, basePower: 1.0 },

  // Rogue
  { id: 'r_stab', name: 'Backstab', desc: 'High damage.', cost: 5, type: 'attack', targetType: 'enemy', minLevel: 1, basePower: 1.5 },
  { id: 'r_mug', name: 'Mug', desc: 'Steal item + Gold.', cost: 10, type: 'attack', targetType: 'enemy', minLevel: 3, basePower: 0.5 },
  { id: 'r_van', name: 'Vanish', desc: 'Boosts Evasion.', cost: 8, type: 'buff', targetType: 'self', minLevel: 5 },
  { id: 'r_pois', name: 'Poison Blade', desc: 'Applies Poison.', cost: 10, type: 'attack', targetType: 'enemy', minLevel: 4, basePower: 1.0 },
];

export const CLASSES: ClassDefinition[] = [
  {
      type: 'WARRIOR', avatar: AVATAR_WARRIOR, description: 'Melee fighter with high defense.',
      hp: 120, mp: 30, str: 10, int: 2, dex: 5, vit: 10, cha: 5,
      skillPool: SKILLS.filter(s => s.id.startsWith('w_')), starterSkillIds: ['w_bash']
  },
  {
      type: 'MAGE', avatar: AVATAR_MAGE, description: 'Master of elemental magic.',
      hp: 70, mp: 100, str: 2, int: 12, dex: 6, vit: 4, cha: 8,
      skillPool: SKILLS.filter(s => s.id.startsWith('m_')), starterSkillIds: ['m_fire']
  },
  {
      type: 'CLERIC', avatar: AVATAR_CLERIC, description: 'Healer and buffer.',
      hp: 90, mp: 80, str: 4, int: 8, dex: 4, vit: 8, cha: 10,
      skillPool: SKILLS.filter(s => s.id.startsWith('c_')), starterSkillIds: ['c_heal']
  },
  {
      type: 'BARBARIAN', avatar: AVATAR_BARBARIAN, description: 'Rages in battle with high HP.',
      hp: 150, mp: 20, str: 12, int: 1, dex: 4, vit: 12, cha: 3,
      skillPool: SKILLS.filter(s => s.id.startsWith('b_')), starterSkillIds: ['b_smash']
  },
  {
      type: 'ARCHER', avatar: AVATAR_ARCHER, description: 'Ranged damage dealer.',
      hp: 90, mp: 40, str: 6, int: 3, dex: 12, vit: 5, cha: 6,
      skillPool: SKILLS.filter(s => s.id.startsWith('a_')), starterSkillIds: ['a_shot']
  },
  {
      type: 'ROGUE', avatar: AVATAR_ROGUE, description: 'Fast and deadly.',
      hp: 80, mp: 50, str: 5, int: 4, dex: 14, vit: 4, cha: 8,
      skillPool: SKILLS.filter(s => s.id.startsWith('r_')), starterSkillIds: ['r_stab']
  }
];

export const generateDungeon = (): number[][][] => {
  const floors: number[][][] = [];
  let previousStairsPos: Position | null = null;

  for (let f = 0; f < 5; f++) {
      const floorMap = Array(DUNGEON_SIZE).fill(0).map(() => Array(DUNGEON_SIZE).fill(1));
      const floorTiles = new Set<string>();

      const startPos = f === 0 ? { x: 1, y: 1 } : previousStairsPos!;
      floorMap[startPos.y][startPos.x] = 0;
      floorTiles.add(`${startPos.x},${startPos.y}`);

      let walkers = [{ x: startPos.x, y: startPos.y }];
      let steps = 600; 

      while (steps > 0) {
          let { x, y } = walkers[Math.floor(Math.random() * walkers.length)];
          
          const dir = Math.floor(Math.random() * 4);
          if (dir === 0) y = Math.max(1, y - 1);
          if (dir === 1) x = Math.min(DUNGEON_SIZE - 2, x + 1);
          if (dir === 2) y = Math.min(DUNGEON_SIZE - 2, y + 1);
          if (dir === 3) x = Math.max(1, x - 1);

          if (floorMap[y][x] === 1) {
            floorMap[y][x] = 0;
            floorTiles.add(`${x},${y}`);
            walkers.push({ x, y });
          }
          steps--;
      }

      for (let i = 0; i < 8; i++) {
          const roomW = Math.floor(Math.random() * 3) + 3;
          const roomH = Math.floor(Math.random() * 3) + 3;
          const roomX = Math.floor(Math.random() * (DUNGEON_SIZE - roomW - 1)) + 1;
          const roomY = Math.floor(Math.random() * (DUNGEON_SIZE - roomH - 1)) + 1;

          for (let rY = 0; rY < roomH; rY++) {
              for (let rX = 0; rX < roomW; rX++) {
                  floorMap[roomY + rY][roomX + rX] = 0;
                  floorTiles.add(`${roomX + rX},${roomY + rY}`);
              }
          }
      }

      const validTiles = Array.from(floorTiles).map(key => {
          const [fx, fy] = key.split(',').map(Number);
          return { x: fx, y: fy };
      });
      
      const potentialStairs = validTiles.filter(p => p.x !== startPos.x || p.y !== startPos.y);

      potentialStairs.sort((a, b) => {
          const distA = Math.hypot(a.x - startPos.x, a.y - startPos.y);
          const distB = Math.hypot(b.x - startPos.x, b.y - startPos.y);
          return distB - distA;
      });

      const stairIndex = Math.floor(Math.random() * Math.max(1, potentialStairs.length * 0.1));
      const stairsPos = potentialStairs.splice(stairIndex, 1)[0];
      
      if (stairsPos) {
          floorMap[stairsPos.y][stairsPos.x] = 3;
          previousStairsPos = { x: stairsPos.x, y: stairsPos.y };
      } else {
          const fallbackPos = { x: DUNGEON_SIZE - 2, y: DUNGEON_SIZE - 2 };
          if(floorMap[fallbackPos.y][fallbackPos.x] === 1) floorMap[fallbackPos.y][fallbackPos.x] = 0;
          floorMap[fallbackPos.y][fallbackPos.x] = 3;
          previousStairsPos = fallbackPos;
      }
      
      const chestCount = Math.floor(Math.random() * 3) + 2;
      for (let c = 0; c < chestCount; c++) {
          if (potentialStairs.length === 0) break;
          const chestIndex = Math.floor(Math.random() * potentialStairs.length);
          const chestPos = potentialStairs.splice(chestIndex, 1)[0];
          floorMap[chestPos.y][chestPos.x] = 4;
      }

      if (f === 0) {
          floorMap[2][1] = 5;
          floorMap[1][2] = 0;
          floorMap[2][2] = 0;
      } else if (Math.random() < 0.3) {
          if (potentialStairs.length > 0) {
              const merchantIndex = Math.floor(Math.random() * potentialStairs.length);
              const merchantPos = potentialStairs.splice(merchantIndex, 1)[0];
              floorMap[merchantPos.y][merchantPos.x] = 5;
          }
      }

      floors.push(floorMap);
  }
  return floors;
};
