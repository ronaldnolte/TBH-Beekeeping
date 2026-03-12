
ALTER TABLE public.hive_snapshots DROP CONSTRAINT "hive_snapshots_hive_id_fkey";
ALTER TABLE public.hive_snapshots ADD CONSTRAINT "hive_snapshots_hive_id_fkey" FOREIGN KEY (hive_id) REFERENCES public.hives(id) ON DELETE CASCADE;

ALTER TABLE public.hives DROP CONSTRAINT "hives_apiary_id_fkey";
ALTER TABLE public.hives ADD CONSTRAINT "hives_apiary_id_fkey" FOREIGN KEY (apiary_id) REFERENCES public.apiaries(id) ON DELETE CASCADE;

ALTER TABLE public.inspections DROP CONSTRAINT "inspections_hive_id_fkey";
ALTER TABLE public.inspections ADD CONSTRAINT "inspections_hive_id_fkey" FOREIGN KEY (hive_id) REFERENCES public.hives(id) ON DELETE CASCADE;

ALTER TABLE public.interventions DROP CONSTRAINT "interventions_hive_id_fkey";
ALTER TABLE public.interventions ADD CONSTRAINT "interventions_hive_id_fkey" FOREIGN KEY (hive_id) REFERENCES public.hives(id) ON DELETE CASCADE;
