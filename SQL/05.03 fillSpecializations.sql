

insert into [SpecializationGroups] select 0, 'Culture', 1, 900,901
insert into [SpecializationGroups] select 1, 'Focus', 1, 902,903
insert into [SpecializationGroups] select 2, 'Ressource Excavation', 3, 904,905
insert into [SpecializationGroups] select 3, 'Ressource Refinement', 1, 906,907



delete from [SpecializationResearches];

insert into [SpecializationResearches] (SpecializationGroupId, ResearchId, SecondaryResearchId)
	select 0, 200, 204 union all
	select 1, 201, 205 union all
	select 2, 202, 206 --union all
	--select 3, 203, 207 

	insert into [SpecializationResearches] (SpecializationGroupId,	 ResearchId,		Building1)
	select														1,			210,			   24	union all
	select														1,			211,			   23	union all
	select														1,			212,			   25 

	insert into [SpecializationResearches] (SpecializationGroupId,	 ResearchId,   Building1,   Module1,	 Module2)
	select														2,			220,		 180,	   1105,		null	   union all
	select														2,			221,		 181,	   1103,		1109	   union all
	select														2,			222,		 182,	   1104,		1110	   union all
	select														2,			223,		 183,	   1101,		1108	   union all
	select														2,			224,		 184,	   1102,		1115   
	
	/*
	insert into [SpecializationResearches] (SpecializationGroupId,	 ResearchId,	  Module1,	 Module2,	Module3 )
	select														3,	 	    230,		 1105,		null,		null		union all
	select														3,	 	    231,		 1103,		null,		null		union all
	select														3,	 	    232,		 1104,		null,		null		union all
	select														3,	 	    233,		 1101,		1108,		1110		union all
	select														3,	 	    234,		 1102,		1109,		1115		
	*/
