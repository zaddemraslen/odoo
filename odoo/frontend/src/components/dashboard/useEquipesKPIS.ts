import { useMemo } from 'react';
import { Equipe } from '../../types/EquipesType';

interface HeatmapAvailabilityDataPoint {
  x: number; // day label
  y: string; // team name
  value: number; // availability score
}

interface HeatmapWorkHoursDataPoint {
  x: number; // day label
  y: string; // team name
  value: number; // Working hours
}

interface HeatmapStaffDataPoint {
  x: number; // day label
  y: string; // team name
  value: number; // Staff
}

export function useEquipesKPIs(equipes: Equipe[]) {

  return useMemo(() => {
    const uniqueTeamNames = Array.from(new Set(equipes.map(e => e.name)));
    const countTeam = uniqueTeamNames.length;

    const availabilityMap: Record<string, number> = {
      "disponible": 2,
      "partielle": 1,
      "occupee": 0,
    };

    const heatmapDataAvailability: HeatmapAvailabilityDataPoint[] = equipes.map((equipe) => {
      const day = Math.floor((equipe.id - equipes[0].id) / countTeam) +1;
      const value = availabilityMap[equipe.disponibilite] ?? 0;
      return {
        x: Math.round(day),
        y: equipe.name,
        value,
      };
    });

    const heatmapDataWorkHours: HeatmapWorkHoursDataPoint[] = equipes.map((equipe) => {
      const day = Math.floor((equipe.id - equipes[0].id) / countTeam) + 1;
      const value = equipe["heures_travaillees"] ?? 0;

      return {
        x: Math.round(day),
        y: equipe.name,
        value,
      };
    });

    const heatmapDataStaff: HeatmapStaffDataPoint[] = equipes.map((equipe) => {
      const day = Math.floor((equipe.id - equipes[0].id) / countTeam) + 1;
      const value = equipe.effectif ?? 0;

      return {
        x: Math.round(day),
        y: equipe.name,
        value,
      };
    });

return { 
  heatmapDataAvailability: heatmapDataAvailability,
  heatmapDataWorkHours: heatmapDataWorkHours,
  heatmapDataStaff: heatmapDataStaff
 };
  }, [equipes]);
}
