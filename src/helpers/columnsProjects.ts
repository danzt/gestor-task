export const columns = [
  {
    name: 'name',
    label: 'Nombre',
    field: 'name',
    align: 'left',
    sortable: true
  },
  {
    name: 'description',
    label: 'Descripción',
    field: 'description',
    align: 'left',
    sortable: true
  },
  {
    name: 'status',
    label: 'Estado',
    field: (row:any) => row.status ? 'Activo' : 'Inactivo',
    align: 'left',
    sortable: true
  },
  {
    name: 'actions',
    required: true,
    label: 'Acciones',
    align: 'center',
    field: 'actions',
  }
];
