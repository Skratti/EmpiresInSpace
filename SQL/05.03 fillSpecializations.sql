
--delete from [SpecializationGroups] where id = 3
insert into [SpecializationGroups] select 0, 'Culture', 1, 900,901
insert into [SpecializationGroups] select 1, 'Focus', 1, 902,903
insert into [SpecializationGroups] select 2, 'Ressource Excavation', 1, 904,905
--insert into [SpecializationGroups] select 3, 'Ressource Refinement', 1, 906,907



delete from [SpecializationResearches];

INSERT [dbo].[SpecializationResearches] 
([SpecializationGroupId], [ResearchId], [SecondaryResearchId], [Building1], [Building2], [Building3], [Module1], [Module2], [Module3] )
select 0,					200,					204,			NULL,		NULL,		NULL,		 NULL,		NULL,		 NULL union all
select 0,					201,					205,			NULL,		NULL,		NULL,		 NULL,		NULL,		 NULL union all
select 0,					202,					206,			NULL,		NULL,		NULL,		 NULL,		NULL,		 NULL union all
select 0,					203,					207,			NULL,		NULL,		NULL,		 NULL,		NULL,		 NULL union all
select 1,					210,					NULL,			24,			NULL,		NULL,		 NULL,		NULL,		 NULL union all
select 1,					211,					NULL,			23,			NULL,		NULL,		 NULL,		NULL,		 NULL union all
select 1,					212,					NULL,			25,			NULL,		NULL,		 NULL,		NULL,		 NULL union all
select 2,					220,					NULL,			180,		NULL,		NULL,		 1105,		NULL,		 NULL union all
select 2,					221,					NULL,			181,		NULL,		NULL,		 1103,		1109,		 NULL union all
select 2,					222,					NULL,			182,		NULL,		NULL,		 1104,		1110,		 NULL union all
select 2,					223,					NULL,			183,		NULL,		NULL,		 1101,		1108,		 NULL union all
select 2,					224,					NULL,			184,		NULL,		NULL,		 1102,		1115,		 NULL
